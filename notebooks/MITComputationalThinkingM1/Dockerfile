FROM julia:1.7.1

ENV JULIA_DEPOT_PATH /.julia
# Hack for Plots.jl's GR Backend. When GKSwstype=100 it does not try to initialize displays for plots
ENV GKSwstype 100
WORKDIR /app

ADD *.toml /app/
RUN julia -e 'using Pkg; Pkg.activate("."); Pkg.instantiate()'

ADD . /app
RUN julia -e 'include("src/build.jl")'

FROM nginx:alpine
COPY --from=0 /app/.out/ /usr/share/nginx/html/

