using Pkg

project_dir = joinpath(@__DIR__, "..") |> realpath
out_dir = out_path = "$(project_dir)/.out"
in_file = "$(project_dir)/src/PlotsGallery2.md.jl"

Pkg.activate(project_dir)
Pkg.instantiate()

using Weave
weave(
    in_file;
    informat = "markdown",
    doctype = "md2html",
    out_path = out_dir,
    keep_unicode = true,
    fig_ext = ".svg"
)
html_file = filter(f -> endswith(f, ".html"), readdir(out_dir))[1] |> f -> joinpath(out_dir, f)
mv(html_file, "$(out_dir)/index.html", force = true)