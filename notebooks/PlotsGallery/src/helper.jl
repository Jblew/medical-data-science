output = ""

macro md_str(s, t...)
    global output *= s * "\n"
end

function writeMD()
    global output
    open(f -> write(f, output), "index.md", "w+")
end

function save_plot(plot; file::String, desc::String)
    mkpath(".fig")
    savefig(plot, ".fig/$(file)")
    plot_img_str = "\n![$desc](.fig/$(file))\n"
    global output *= plot_img_str
end