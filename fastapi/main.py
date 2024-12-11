import sqlite3
import numpy as np
from datetime import datetime, timezone
import matplotlib.pyplot as plt
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


def adapt_datetime_iso(dt: datetime) -> str:
    return dt.isoformat()


sqlite3.register_adapter(datetime, adapt_datetime_iso)


def convert_datetime_iso(date_string: bytes) -> datetime:
    return datetime.fromisoformat(date_string.decode())


sqlite3.register_converter("datetime", convert_datetime_iso)


def custom_generate_unique_id(route: APIRoute) -> str:
    """Generate the name for the API endpoint."""
    return route.name


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup

    with sqlite3.connect(
        "bookingapp.db", check_same_thread=False, detect_types=sqlite3.PARSE_DECLTYPES
    ) as con:
        con.execute(
            """
    create table if not exists appts (
        appt_id                integer   primary key,
        customer_freeform_name text      not null,
        customer_note          text      not null,
        appt_at_freeform       text      not null,
        duration_minutes       integer,
        created_at_utc         timestamp not null,
        updated_at_utc         timestamp not null
    )
    """
        )

    yield  # pass control to FastAPI
    # shutdown


app = FastAPI(generate_unique_id_function=custom_generate_unique_id, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, allow_origins=["http://localhost:1234"], allow_methods=["*"]
)


class NullDatetime(BaseModel):
    valid: bool
    datetime: datetime


zero_dt = datetime(year=1970, month=1, day=1, tzinfo=timezone.utc)


class ReadAppointmentResponse(BaseModel):
    appointment_id: int = Field(examples=[1])
    customer_freeform_name: str = Field(examples=["Bob"])
    customer_note: str = Field(examples=["Men's haircut"])
    appt_at_freeform: str = Field(examples=["Tomorrow at 10am"])
    appt_at_utc: NullDatetime = Field(
        examples=[
            NullDatetime(valid=False, datetime=zero_dt),
        ]
    )


class HTTPError(BaseModel):
    detail: str

    class Config:
        schema_extra = {"example": {"detail": "HTTPException"}}


def try_datetime_fromisoformat(date_string: str) -> NullDatetime:
    try:
        dt = datetime.fromisoformat(date_string)
        return NullDatetime(valid=True, datetime=dt)
    except ValueError:  # invalid format
        return NullDatetime(valid=False, datetime=zero_dt)


@app.get(
    "/appointments/{appointment_id}",
    responses={404: {"model": HTTPError, "description": "Not Found"}},
)
async def read_appointment(appointment_id: int) -> ReadAppointmentResponse:
    with sqlite3.connect(
        "bookingapp.db", check_same_thread=False, detect_types=sqlite3.PARSE_DECLTYPES
    ) as con:
        cur = con.execute(
            """
select appt_id, customer_freeform_name, customer_note, appt_at_freeform from appts
where appt_id=:appt_id
""",
            {"appt_id": appointment_id},
        )
        row = cur.fetchone()
        if row is None:
            # not found
            raise HTTPException(status_code=404, detail="Appointment not found.")
        appt_id, customer_freeform_name, customer_note, appt_at_freeform = row

        appt_at = try_datetime_fromisoformat(appt_at_freeform)
        appt_at_utc = appt_at.copy()
        appt_at_utc.datetime.astimezone(tz=timezone.utc)

        appt = ReadAppointmentResponse(
            appointment_id=appt_id,
            customer_freeform_name=customer_freeform_name,
            customer_note=customer_note,
            appt_at_freeform=appt_at_freeform,
            appt_at_utc=appt_at_utc,
        )
    return appt


@app.get("/appointments")
async def read_appointments() -> list[ReadAppointmentResponse]:
    """
    NOTE: Returns max 20 rows!
    """
    with sqlite3.connect(
        "bookingapp.db", check_same_thread=False, detect_types=sqlite3.PARSE_DECLTYPES
    ) as con:
        cur = con.execute(
            """
select appt_id, customer_freeform_name, customer_note, appt_at_freeform from appts
order by created_at_utc desc
limit 20
                """
        )
        rows = cur.fetchall()
        appts: list[ReadAppointmentResponse] = []
        for row in rows:
            appt_id, customer_freeform_name, customer_note, appt_at_freeform = row

            appt_at = try_datetime_fromisoformat(appt_at_freeform)
            appt_at_utc = appt_at.copy()
            appt_at_utc.datetime.astimezone(tz=timezone.utc)

            appt = ReadAppointmentResponse(
                appointment_id=appt_id,
                customer_freeform_name=customer_freeform_name,
                customer_note=customer_note,
                appt_at_freeform=appt_at_freeform,
                appt_at_utc=appt_at_utc,
            )
            appts.append(appt)
    return appts


class CreateAppointment(BaseModel):
    customer_freeform_name: str = Field(examples=["Bob"])
    customer_note: str = Field(examples=["Men's haircut"])
    appt_at_freeform: str = Field(examples=["Tomorrow at 10am"])
    duration_minutes: str = Field(examples=[10])


@app.post(
    "/appointments", status_code=201, response_description="The created apointment ID"
)
def create_appointment(appt: CreateAppointment) -> int:
    with sqlite3.connect(
        "bookingapp.db", check_same_thread=False, detect_types=sqlite3.PARSE_DECLTYPES
    ) as con:
        cur = con.execute(
            """
insert into appts(
    customer_freeform_name,
    customer_note,
    appt_at_freeform,
    duration_minutes,
    created_at_utc,
    updated_at_utc
)
values (
    :customer_freeform_name,
    :customer_note,
    :appt_at_freeform,
    :duration_minutes,
    datetime('now'),
    datetime('now')
)
""",
            {
                "customer_freeform_name": appt.customer_freeform_name,
                "customer_note": appt.customer_note,
                "appt_at_freeform": appt.appt_at_freeform,
                "duration_minutes": appt.duration_minutes,
            },
        )
        appt_id = cur.lastrowid
        if appt_id is None:
            raise Exception("appt_id is None")
    return appt_id


def viz_slot_allocation():
    # appt_at_freeform str: 2024-12-03 09:45 AM
    # time 00-24h or 00-1400m
    # resolution by minutes

    # 24h x 60min blocks
    p1 = np.zeros((24, 60), int)
    p1[0, 0:60] = 1  # 00:00-00:59
    new_p1 = p1.flatten()
    new_p1[2 * 60 + 0 : 2 * 60 + 60] |= 2  # 03:00-03:59
    p1 = new_p1.reshape(p1.shape)
    p1[3, 0:30] |= 4  # 04:00-04:30
    new_p1 = p1.flatten()
    new_p1[3 * 60 + 30 : 3 * 60 + 60] |= 8  # 04:30-04:59
    p1 = new_p1.reshape(p1.shape)

    # plt.imshow(p1)
    # plt.show()

    p2 = np.zeros((24, 60), int)
    p2[1, 0:60] = 1  # 01:00-01:59

    # people-first
    grid = np.stack((p1, p2), axis=0)

    # np.set_printoptions(threshold=np.inf)
    # print(grid)

    rows = 1
    cols = grid.shape[0]
    canvas_inches = (cols * 8, rows * 8)
    _, axes = plt.subplots(rows, grid.shape[0], figsize=canvas_inches)
    for i in range(grid.shape[0]):
        ax = axes[i]
        ax.set_title(f"p{i}")
        ax.imshow(grid[i, :, :], aspect="auto")
    plt.show()


if __name__ == "__main__":
    viz_slot_allocation()
