from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def helth_check():
    return {"status": "ok"}