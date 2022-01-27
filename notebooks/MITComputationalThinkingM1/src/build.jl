using Pkg

project_dir = joinpath(@__DIR__, "..") |> realpath
out_dir = out_path = "$(project_dir)/.out"
in_files = [
    "$(project_dir)/src/index.md.jl",
    "$(project_dir)/src/lesson1.md.jl"
]

Pkg.activate(project_dir)
Pkg.instantiate()

using Weave
for in_file in in_files
    weave(in_file;
        informat = "markdown",
        doctype = "md2html",
        out_path = out_dir,
        keep_unicode = true,
        fig_ext = ".svg"
    )
end
mv("$(out_dir)/index.md.html", "$(out_dir)/index.html", force = true)