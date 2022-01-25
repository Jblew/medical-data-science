FROM julia:1.7.1

ENV JULIA_DEPOT_PATH /.julia
# 
ENV GKSwstype 100
WORKDIR /app

RUN apt update && apt install -y pandoc
ADD *.toml /app/

RUN julia -e 'using Pkg; Pkg.activate("."); Pkg.instantiate()'

ADD . /app
RUN julia -e 'using Pkg; Pkg.activate("."); Pkg.instantiate(); include("src/PlotsGallery.jl")'

RUN pandoc index.md -o index.html

FROM nginx:alpine
COPY --from=0 /app/ /usr/share/nginx/html/
RUN ls /usr/share/nginx/html/
