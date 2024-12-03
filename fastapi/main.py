import sqlite3
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


def custom_generate_unique_id(route: APIRoute) -> str:
    """Generate the name for the API endpoint."""
    return route.name


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup

    with sqlite3.connect("bookingapp.db", check_same_thread=False) as con:
        con.execute(
            """
    create table if not exists appts (
        appt_id                integer   primary key,
        customer_freeform_name text      not null,
        customer_note          text      not null,
        appt_at_freeform       text      not null,
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


class ReadAppointmentResponse(BaseModel):
    appointment_id: int = Field(examples=[1])
    customer_freeform_name: str = Field(examples=["Bob"])
    customer_note: str = Field(examples=["Men's haircut"])
    appt_at_freeform: str = Field(examples=["Tomorrow at 10am"])


class HTTPError(BaseModel):
    detail: str

    class Config:
        schema_extra = {"example": {"detail": "HTTPException"}}


@app.get(
    "/appointments/{appointment_id}",
    responses={404: {"model": HTTPError, "description": "Not Found"}},
)
async def read_appointment(appointment_id: int) -> ReadAppointmentResponse:
    with sqlite3.connect("bookingapp.db", check_same_thread=False) as con:
        cur = con.execute(
            """
select appt_id, customer_freeform_name, customer_note, appt_at_freeform from appts
where appt_id=?
""",
            (appointment_id,),
        )
        row = cur.fetchone()
        if row is None:
            # not found
            raise HTTPException(status_code=404, detail="Appointment not found.")
        appt_id, customer_freeform_name, customer_note, appt_at_freeform = row
        appt = ReadAppointmentResponse(
            appointment_id=appt_id,
            customer_freeform_name=customer_freeform_name,
            customer_note=customer_note,
            appt_at_freeform=appt_at_freeform,
        )
    return appt


@app.get("/appointments")
async def read_appointments() -> list[ReadAppointmentResponse]:
    """
    NOTE: Returns max 20 rows!
    """
    with sqlite3.connect("bookingapp.db", check_same_thread=False) as con:
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
            appt = ReadAppointmentResponse(
                appointment_id=appt_id,
                customer_freeform_name=customer_freeform_name,
                customer_note=customer_note,
                appt_at_freeform=appt_at_freeform,
            )
            appts.append(appt)
    return appts


class CreateAppointment(BaseModel):
    customer_freeform_name: str = Field(examples=["Bob"])
    customer_note: str = Field(examples=["Men's haircut"])
    appt_at_freeform: str = Field(examples=["Tomorrow at 10am"])


@app.post(
    "/appointments", status_code=201, response_description="The created apointment ID"
)
def create_appointment(appt: CreateAppointment) -> int:
    with sqlite3.connect("bookingapp.db", check_same_thread=False) as con:
        cur = con.execute(
            """
insert into appts(
    customer_freeform_name,
    customer_note,
    appt_at_freeform,
    created_at_utc,
    updated_at_utc
)
values (
    ?,
    ?,
    ?,
    datetime('now'),
    datetime('now')
)
""",
            (appt.customer_freeform_name, appt.customer_note, appt.appt_at_freeform),
        )
        appt_id = cur.lastrowid
        if appt_id is None:
            raise Exception("appt_id is None")
    return appt_id
