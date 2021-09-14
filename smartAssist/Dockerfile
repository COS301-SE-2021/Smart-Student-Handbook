FROM python:3.9

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY ./src /app

ENV PORT=6001

EXPOSE 6001

CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 1 api:app
