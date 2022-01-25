# Plots gallery 2


```julia
using Plots, StatsPlots, DataFrames, Query, ColorSchemes, CSV
```

### 1. Bar plot with CSV, query and ColorSchemes

```julia
begin
    df = DataFrame(CSV.File("../data/pyll_per_country.csv"))
    pyll_2018_df = @from i in df begin
        @where i.TIME == 2018 && i.SUBJECT == "TOT"
        @orderby i.Value
        @select i
        @collect DataFrame
    end
    palette = cgrad(:BrBG_10)
    p = plot(
        pyll_2018_df.LOCATION, pyll_2018_df.Value;
        seriestype = :bar, size = (700, 350),
        xticks = (0.5:size(pyll_2018_df.LOCATION, 1), pyll_2018_df.LOCATION),
        xrotation = 90, seriescolor = ColorSchemes.prism.colors,
        title = "PYLL/100k in OECD countries"
    )

    p
end
```

### 2. Draw rectangles in the plot

```julia
begin
    # define a function that returns a Plots.Shape
    rectangle(w, h, x, y) = Shape(x .+ [0, w, w, 0], y .+ [0, 0, h, h])

    # p = plot(0:5,0:5)
    p = plot(rectangle(3, 2, 0, 0), opacity = 0.5)
    plot!(p, rectangle(1, 1, 4, 3), opacity = 0.5)
    plot!(p, rectangle(1, 1, 2, 2), opacity = 0.5)
    plot!(p, rectangle(1, 1, 5, 0), opacity = 0.5)
end
```

```julia
begin
    vec = [1, 2, 3]
    (vec, +, .+, vec .+ 1)
end
```

### 3. Multiple plots

```julia
begin
    x = 1:10
    y = rand(10, 2)
    p1 = plot(x, y) # Make a line plot
    p2 = scatter(x, y) # Make a scatter plot
    p3 = plot(x, y, xlabel = "This one is labelled", lw = 3, title = "Subtitle")
    p4 = histogram(x, y) # Four histograms each with 10 points? Why not!
    p = plot(p1, p2, p3, p4, layout = (2, 2), legend = false)
end
```

### 4. Animated multiple plots

```julia
begin
    anim = @animate for i ∈ [p1, p2, p3, p4]
        plot(i)
    end
    gif(anim, fps = 1)
end
```

```julia
### 5. Animation
```

```julia
@gif for i in 1:100
    plot(sin, 0, i * 2pi / 90)
end when i > 30

# @gif macro is simpler than animation - e.g. it currently does not allow specifying fps
```


### 6. Named ticks in plot

```
yticks=([]::Vector{Number}, []::Vector{String})
```

First argument is a vector of values and the second one is a vector of labels.
Eg.:

```
yticks=(
	[0, 	  10,             20,       30],
	["Zimno", "Umiarkowanie", "Ciepło", "Gorąco"],
)
```

```julia
begin
    plotAliveOrDead = plot(
        [0, 1, 2, 3, 4],
        [1, 1, 1, 0, 0];
        opacity = 1,
        color = :green,
        label = "Życie człowieka",
        legend = :topleft,
        xlabel = "Długość życia",
        yticks = ([0, 1], ["Martwy", "Żywy"]),
        ann = [(72.5, 50, text("Zdrowi", 10))]
    )
    # yticks
end
```

### 7. How to check active Plots backend

```julia
backend()
```


### 8. Arrows on plots

```julia
begin
    plotJakosc = plot(
        [0, 30, 78.58], [1.0, 1.0, 0.0],
        seriestype = :line, linewidth = 3, linecolor = :red,
    )
    plot!(plotJakosc,
        [20, 30], [0.8, 1.0], arrow = (:closed, 2.0), color = :black, label = nothing,
        ann = [(20, 0.8, text("Zachorowanie"))]
    )
end
```


### 9. Annotation text size and color on plots
```
text("Zachorowanie", 10, :blue)
```

Order of arguments for text constructor doesnt matter. Size is int, tilt is float

```julia
begin
    plotWithAnnotation = plot(
        [0, 30, 78.58], [1.0, 1.0, 0.0],
        seriestype = :line, linewidth = 3, linecolor = :red,
    )
    plot!(plotWithAnnotation,
        [20, 30], [0.8, 1.0], arrow = (:closed, 2.0), color = :black, label = nothing,
        ann = [(20, 0.8, text("Zachorowanie", 10, :blue))]
    )
end
```
