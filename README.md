## React Web

1. Install

```bash
# node v18+
yarn
mv db/db_example.json db/db.json # make a working copy db.json
```

2. Run

```bash
yarn json-server database/db_develop.json
yarn parcel src/index.html
```

## FastAPI

1. Install

```bash
cd fastapi
python3.11 -m venv .venv # 3.11.9
source .venv/bin/activate # different on windows! (note that vscode may already do this automatically)
pip install -r requirements.txt
pre-commit install
```

2. Run

```bash
fastapi dev main.py
```
