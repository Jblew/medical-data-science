FROM python:3.9

WORKDIR /app

RUN pip3 install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN pip3 install nbconvert

COPY . .

RUN jupyter nbconvert \
    --to html \
    --ExecutePreprocessor.allow_errors=True \
    --ExecutePreprocessor.timeout=300 \
    --FilesWriter.build_directory=./.out \
    --execute notebook.ipynb
RUN mv .out/notebook.html .out/index.html

FROM nginx:alpine
COPY --from=0 /app/.out/ /usr/share/nginx/html/