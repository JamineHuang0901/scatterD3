var custom_scheme10 = d3.schemeCategory10,
    tmp = custom_scheme10[3];
custom_scheme10[3] = custom_scheme10[1];
custom_scheme10[1] = tmp;

var gear_path = "m 24.28,7.2087374 -1.307796,0 c -0.17052,-0.655338 -0.433486,-1.286349 -0.772208,-1.858846 l 0.927566,-0.929797 c 0.281273,-0.281188 0.281273,-0.738139 0,-1.019312 L 21.600185,1.8728727 C 21.319088,1.591685 20.863146,1.5914219 20.582048,1.8726096 L 19.650069,2.8001358 C 19.077606,2.4614173 18.446602,2.1982296 17.791262,2.0278389 l 0,-1.30783846 c 0,-0.39762 -0.313645,-0.72 -0.711262,-0.72 l -2.16,0 c -0.397618,0 -0.711262,0.32238 -0.711262,0.72 l 0,1.30783846 c -0.65534,0.1703907 -1.286345,0.43344 -1.858849,0.7722138 L 11.420092,1.8724435 c -0.281185,-0.2812846 -0.738131,-0.2812846 -1.019315,0 L 8.8728737,3.3998124 C 8.5916888,3.6809174 8.591427,4.1368574 8.872612,4.4179484 l 0.9275234,0.931984 c -0.3388099,0.572456 -0.6019076,1.203467 -0.7722956,1.858805 l -1.3078398,0 c -0.3976159,0 -0.72,0.313643 -0.72,0.711263 L 7,10.08 c 0,0.397661 0.3223841,0.711263 0.72,0.711263 l 1.3078398,0 c 0.170388,0.655338 0.4334414,1.286349 0.7722084,1.858846 L 8.872349,13.579906 c -0.2811836,0.281105 -0.2811836,0.738139 0,1.019188 l 1.527378,1.527951 c 0.281185,0.28127 0.737041,0.281533 1.018224,3.04e-4 l 0.931981,-0.927484 c 0.572461,0.338718 1.203466,0.601823 1.858806,0.772338 l 0,1.307797 c 0,0.397662 0.313644,0.72 0.711262,0.72 l 2.16,0 c 0.39766,0 0.711262,-0.32238 0.711262,-0.72 l 0,-1.307797 c 0.65534,-0.170515 1.286344,-0.433481 1.858849,-0.772214 l 0.929797,0.927568 c 0.281098,0.281271 0.738131,0.281271 1.019184,0 l 1.527947,-1.527369 c 0.281273,-0.281105 0.281534,-0.737045 3.06e-4,-1.018136 l -0.92748,-0.931984 c 0.338723,-0.572456 0.601819,-1.203467 0.772339,-1.858805 l 1.307796,0 c 0.39766,0 0.72,-0.313643 0.72,-0.711263 l 0,-2.1599996 c 0,-0.39762 -0.322384,-0.711263 -0.72,-0.711263 z M 16,12.6 c -1.988258,0 -3.6,-1.611789 -3.6,-3.5999996 0,-1.988252 1.611742,-3.6 3.6,-3.6 1.988258,0 3.6,1.611748 3.6,3.6 C 19.6,10.988252 17.988258,12.6 16,12.6 Z";


function scatterD3() {

    var width = 600, // default width
	height = 600, // default height
	dims = {},
	margin = {top: 5, right: 10, bottom: 20, left: 30, legend_top: 50},
	settings = {},
	data = [],
	x, y, x_orig, y_orig, color_scale, symbol_scale, size_scale, opacity_scale,
	xAxis, yAxis,
	svg, root, chart_body,
	draw_line, zoom, drag,
	lasso_base, lasso_classes;

    function setup_sizes() {

	if (settings.left_margin !== null) {
	    margin.left = settings.left_margin;
	}

        dims.legend_width = 0;
        if (settings.has_legend) dims.legend_width = settings.legend_width;

        dims.width = width - dims.legend_width;
        dims.height = height;
        dims.height = dims.height - margin.top - margin.bottom;
        dims.width = dims.width - margin.left - margin.right;

        // Fixed ratio
        if (settings.fixed) {
            dims.height = Math.min(dims.height, dims.width);
            dims.width = dims.height;
        }

        dims.total_width = dims.width + margin.left + margin.right + dims.legend_width;
        dims.total_height = dims.height + margin.top + margin.bottom;

        dims.legend_x = dims.total_width - margin.right - dims.legend_width + 24;
    }

    function setup_scales() {

	var min_x, min_y, max_x, max_y, gap_x, gap_y;

        // x and y limits
        if (settings.xlim === null) {
            min_x = d3.min(data, function(d) { return(d.x);} );
            max_x = d3.max(data, function(d) { return(d.x);} );
            gap_x = (max_x - min_x) * 0.2;
        } else {
            min_x = settings.xlim[0];
            max_x = settings.xlim[1];
            gap_x = 0;
        }
        if (settings.ylim === null) {
            min_y = d3.min(data, function(d) { return(d.y);} );
            max_y = d3.max(data, function(d) { return(d.y);} );
            gap_y = (max_y - min_y) * 0.2;
        } else {
            min_y = settings.ylim[0];
            max_y = settings.ylim[1];
            gap_y = 0;
        }

        // Fixed ratio
        if (settings.fixed && !(settings.xlim !== null && settings.ylim !== null)) {
            if (settings.xlim === null && settings.ylim === null) {
		min_x = min_y = Math.min(min_x, min_y);
		max_x = max_y = Math.max(max_x, max_y);
		gap_x = gap_y = Math.max(gap_x, gap_y);
            }
            if (settings.xlim !== null) {
		min_y = min_x;
		max_y = max_x;
		gap_y = gap_x;
            }
            if (settings.ylim !== null) {
		min_x = min_y;
		max_x = max_y;
		gap_x = gap_y;
            }
        }

        // x, y scales
	if (!settings.x_categorical) {
            x = d3.scaleLinear()
		.range([0, dims.width])
		.domain([min_x - gap_x, max_x + gap_x]);
	} else {
	    x = d3.scalePoint()
	    	.range([0, dims.width])
		.padding(0.9)
		.domain(d3.map(data, function(d){ return d.x; }).keys().sort());
	}
	if (!settings.y_categorical) {
            y = d3.scaleLinear()
		.range([dims.height, 0])
		.domain([min_y - gap_y, max_y + gap_y]);
	} else {
	    y = d3.scalePoint()
	    	.range([dims.height, 0])
		.padding(0.9)
		.domain(d3.map(data, function(d){ return d.y; }).keys().sort());
	}
        // Keep track of original scales
        x_orig = x;
        y_orig = y;
	// x and y axis functions
        xAxis = d3.axisBottom(x)
            .tickSize(-dims.height);
        yAxis = d3.axisLeft(y)
            .tickSize(-dims.width);

	// Continuous color scale
	if (settings.col_continuous) {
	    color_scale = d3.scaleSequential(d3.interpolateViridis)
		.domain([d3.min(data, function(d) { return(d.col_var);} ),
			 d3.max(data, function(d) { return(d.col_var);} )]);
	}
	// Ordinal color scale
	else {
            if (settings.colors === null) {
		// Number of different levels. See https://github.com/mbostock/d3/issues/472
		var n = d3.map(data, function(d) { return d.col_var; }).size();
		color_scale = n <= 9 ? d3.scaleOrdinal(custom_scheme10) : d3.scaleOrdinal(d3.schemeCategory20);
            } else if (Array.isArray(settings.colors)) {
		color_scale = d3.scaleOrdinal().range(settings.colors);
            } else if (typeof(settings.colors) === "string"){
		// Single string given
		color_scale = d3.scaleOrdinal().range(Array(settings.colors));
            } else if (typeof(settings.colors) === "object"){
		color_scale = d3.scaleOrdinal()
                    .range(d3.values(settings.colors))
                    .domain(d3.keys(settings.colors));
            }
	}
	// Symbol scale
        symbol_scale = d3.scaleOrdinal().range(d3.range(d3.symbols.length));
	// Size scale
	size_scale = d3.scaleLinear()
            .range(settings.size_range)
            .domain([d3.min(data, function(d) { return(d.size_var);} ),
                     d3.max(data, function(d) { return(d.size_var);} )]);
	// Opacity scale
        opacity_scale = d3.scaleLinear()
            .range([0.1, 1])
            .domain([d3.min(data, function(d) { return(d.opacity_var);} ),
                     d3.max(data, function(d) { return(d.opacity_var);} )]);

        // Zoom behavior
        zoom = d3.zoom()
            .scaleExtent([0, 32])
            .on("zoom", zoomed);

    }

    // Key function to identify rows when interactively filtering
    function key(d) {
        return d.key_var;
    }

    // Default translation function for points and labels
    function translation(d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    }

    // Zoom function
    function zoomed(reset) {
	if (!settings.x_categorical) {
            x = d3.event.transform.rescaleX(x_orig);
            xAxis = xAxis.scale(x);
            root.select(".x.axis").call(xAxis);
	}
	if (!settings.y_categorical) {
            y = d3.event.transform.rescaleY(y_orig);
            yAxis = yAxis.scale(y);
            root.select(".y.axis").call(yAxis);
	}
        chart_body.selectAll(".dot, .point-label")
            .attr("transform", translation);
	chart_body.selectAll(".line").call(line_formatting);
        chart_body.selectAll(".arrow").call(draw_arrow);
        chart_body.selectAll(".ellipse").call(ellipse_formatting);
        svg.select(".unit-circle").call(unit_circle_init);
        if (typeof settings.zoom_callback === 'function') {
		      settings.zoom_callback(x.domain()[0], x.domain()[1], y.domain()[0], y.domain()[1]);
		    }
    }

    // Reset zoom function
    function reset_zoom() {
        root.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }

    // Export to SVG function
    function export_svg() {
        var svg_content = svg
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("version", 1.1)
            .node().parentNode.innerHTML;
        // Dirty dirty dirty...
        var tmp = svg_content.replace(/<g class="gear-menu[\s\S]*?<\/g>/, '');
        var svg_content2 = tmp.replace(/<ul class="scatterD3-menu[\s\S]*?<\/ul>/, '');
        var image_data = "data:image/octet-stream;base64," + window.btoa(svg_content2);
        d3.select(this)
            .attr("download", settings.html_id + ".svg")
            .attr("href", image_data);
    }

    // Function to export custom labels position to CSV file
    function export_labels_position() {
	var lines_data = ["scatterD3_label,scatterD3_label_x,scatterD3_label_y"];
	data.forEach(function(d, index){
            var labx = d.x;
            if (d.lab_dx !== undefined) {
		labx = d.x + x.invert(d.lab_dx) - x.domain()[0];
            }
            var size = (d.size_var === undefined) ? settings.point_size : size_scale(d.size_var);
            var offset_y = (-Math.sqrt(size) / 2) - 6;
            if (d.lab_dy !== undefined) {
		offset_y = d.lab_dy;
            }
            var laby = d.y + y.invert(offset_y) - y.domain()[1];
            var this_line = d.lab + "," + labx + "," + laby;
            lines_data.push(this_line);
	});
	var csv_content = "data:text/csv;base64," + btoa(lines_data.join("\n"));
	d3.select(this)
            .attr("download", settings.html_id + "_labels.csv")
            .attr("href", encodeURI(csv_content));
    }

    // Create and draw x and y axes
    function add_axes(selection) {

        // x axis
        selection.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + dims.height + ")")
            .style("font-size", settings.axes_font_size)
            .call(xAxis);

        selection.append("text")
            .attr("class", "x-axis-label")
            .attr("transform", "translate(" + (dims.width - 5) + "," + (dims.height - 6) + ")")
            .style("text-anchor", "end")
            .style("font-size", settings.axes_font_size)
            .text(settings.xlab);

        // y axis
        selection.append("g")
            .attr("class", "y axis")
            .style("font-size", settings.axes_font_size)
            .call(yAxis);

        selection.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "translate(5,6) rotate(-90)")
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(settings.ylab);

    }

    // Zero horizontal and vertical lines
    draw_line = d3.line()
	.x(function(d) {return d.x;})
	.y(function(d) {return d.y;});

    // Create tooltip content function
    function tooltip_content(d) {
        // no tooltips
        if (!settings.has_tooltips) return null;
        if (settings.has_custom_tooltips) {
            // custom tooltipsl
            return d.tooltip_text;
        } else {
            // default tooltips
            var text = Array();
            if (settings.has_labels) text.push("<b>"+d.lab+"</b>");
	    var x_value = settings.x_categorical ? d.x : d.x.toFixed(3);
	    var y_value = settings.y_categorical ? d.y : d.y.toFixed(3);
            text.push("<b>"+settings.xlab+":</b> "+ x_value);
            text.push("<b>"+settings.ylab+":</b> "+ y_value);
            if (settings.has_color_var) text.push("<b>"+settings.col_lab+":</b> "+d.col_var);
            if (settings.has_symbol_var) text.push("<b>"+settings.symbol_lab+":</b> "+d.symbol_var);
            if (settings.has_size_var) text.push("<b>"+settings.size_lab+":</b> "+d.size_var);
            if (settings.has_opacity_var) text.push("<b>"+settings.opacity_lab+":</b> "+d.opacity_var);
            return text.join("<br />");
        }
    }

    // Clean variables levels to be valid CSS classes
    function css_clean(s) {
	if (s === undefined) return "";
	return s.toString().replace(/[^\w-]/g, "_");
    }


    function line_init(selection) {
	selection
	    .attr("class", "line");
    }

    function line_formatting(selection) {
	selection
	    .attr("d", function(d) {
		// Categorical variables
		if (settings.x_categorical && settings.y_categorical) { return null; };
		if (settings.x_categorical) {
		    if (d.slope != 0) { return null; }
		    else {
			return draw_line([{x:0, y: y(d.intercept)},
					  {x:dims.width, y: y(d.intercept)}]);
		    }
		}
		if (settings.y_categorical) {
		    if (d.slope !== null) { return null; }
		}
		// Vertical line
		if (d.slope === null) {
		    return draw_line([{x:x(d.intercept), y: 0},
				      {x:x(d.intercept), y: dims.height}]);
		}
		// All other lines
		else {
		    return draw_line([{x:0, y: y(d.slope * x.domain()[0] + d.intercept)},
				      {x:dims.width, y: y(d.slope * x.domain()[1] + d.intercept)}]);
		}
	    })
	    .style("stroke-width", function(d) {
		return d.stroke_width !== undefined && d.stroke_width !== null ? d.stroke_width : "1px";
	    })
	    .style("stroke", function(d) {
		return d.stroke !== undefined && d.stroke !== null ? d.stroke : "#000000";
	    })
	    .style("stroke-dasharray", function(d) {
		return d.stroke_dasharray !== undefined && d.stroke_dasharray !== null ? d.stroke_dasharray : null;
	    });

    }

    // Returns dot size from associated data
    function dot_size(data) {
        var size = settings.point_size;
        if (settings.has_size_var) { size = size_scale(data.size_var); }
        return(size);
    }

    // Initial dot attributes
    function dot_init (selection) {
        // tooltips when hovering points
        var tooltip = d3.select(".scatterD3-tooltip");
        selection.on("mouseover", function(d, i){
            d3.select(this)
                .transition().duration(150)
                .attr("d", d3.symbol()
		      .type(function(d) { return d3.symbols[symbol_scale(d.symbol_var)]; })
		      .size(function(d) { return (dot_size(d) * settings.hover_size); })
		     )
                .style("opacity", function(d) {
		    if (settings.hover_opacity !== null) {
			return settings.hover_opacity;
		    } else {
			return(d.opacity_var === undefined ? settings.point_opacity : opacity_scale(d.opacity_var));
		    }
                });
	    if (settings.has_url_var) {
                d3.select(this)
		    .style("cursor", function(d) {
			return (d.url_var != "" ? "pointer" : "default");
		    });
	    }
	    if (settings.has_tooltips) {
                tooltip.style("visibility", "visible")
		    .html(tooltip_content(d));
	    }
        });
        selection.on("mousemove", function(){
	    if (settings.has_tooltips) {
		tooltip.style("top", (d3.event.pageY+15)+"px").style("left",(d3.event.pageX+15)+"px");
	    }
        });
        selection.on("mouseout", function(){
            d3.select(this)
                .transition().duration(150)
                .attr("d", d3.symbol()
		      .type(function(d) { return d3.symbols[symbol_scale(d.symbol_var)]; })
		      .size(function(d) { return dot_size(d);})
		     )
                .style("opacity", function(d) {
			return(d.opacity_var === undefined ? settings.point_opacity : opacity_scale(d.opacity_var));
		});
	    if (settings.has_tooltips) {
                    tooltip.style("visibility", "hidden");
	    }
        });
	selection.on("click", function(d, i) {
	    if (typeof settings.click_callback === 'function') {
		settings.click_callback(settings.html_id, i + 1);
	    }
	    if (settings.has_url_var && d.url_var != "") {
		var win = window.open(d.url_var, '_blank');
		win.focus();
	    }
        });
    }

    // Apply format to dot
    function dot_formatting(selection) {
        var sel = selection
            .attr("transform", translation)
        // fill color
            .style("fill", function(d) { return color_scale(d.col_var); })
	    .style("opacity", function(d) {
		return d.opacity_var !== undefined ? opacity_scale(d.opacity_var) : settings.point_opacity;
	    })
        // symbol and size
            .attr("d", d3.symbol()
		  .type(function(d) {return d3.symbols[symbol_scale(d.symbol_var)];})
		  .size(function(d) { return dot_size(d); })
		 )
            .attr("class", function(d,i) {
		return "dot symbol symbol-c" + css_clean(d.symbol_var) + " color color-c" + css_clean(d.col_var);
            });
        return sel;
    }

    // Arrow drawing function
    function draw_arrow(selection) {
        selection
            .attr("x1", function(d) { return x(0); })
            .attr("y1", function(d) { return y(0); })
            .attr("x2", function(d) { return x(d.x); })
            .attr("y2", function(d) { return y(d.y); });
    }

    // Initial arrow attributes
    function arrow_init (selection) {
        // tooltips when hovering points
        if (settings.has_tooltips) {
            var tooltip = d3.select(".scatterD3-tooltip");
            selection.on("mouseover", function(d, i){
                tooltip.style("visibility", "visible")
                    .html(tooltip_content(d));
            });
            selection.on("mousemove", function(){
                tooltip.style("top", (d3.event.pageY+15)+"px").style("left",(d3.event.pageX+15)+"px");
            });
            selection.on("mouseout", function(){
                tooltip.style("visibility", "hidden");
            });
        }
    }

    // Apply format to arrow
    function arrow_formatting(selection) {
        var sel = selection
            .call(draw_arrow)
            .style("stroke-width", "1px")
        // stroke color
            .style("stroke", function(d) { return color_scale(d.col_var); })
            .attr("marker-end", function(d) { return "url(#arrow-head-" + settings.html_id + "-" + color_scale(d.col_var) + ")"; })
            .attr("class", function(d,i) { return "arrow color color-c" + css_clean(d.col_var); });
        if (settings.opacity_changed || settings.subset_changed || settings.redraw) {
            sel = sel.style("opacity", function(d) {
		return d.opacity_var !== undefined ? opacity_scale(d.opacity_var) : settings.point_opacity;
	    });
        }
        return sel;
    }

    // Initial ellipse attributes
    function ellipse_init(selection) {
        selection
            .style("fill", "none");
    }

    // Apply format to ellipse
    function ellipse_formatting(selection) {

        // Ellipses path function
        var ellipseFunc = d3.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });

        selection
            .attr("d", function(d) {
		var ell = HTMLWidgets.dataframeToD3(d.data);
		return (ellipseFunc(ell));
            })
            .style("stroke", function(d) {
		// Only one ellipse
		if (d.level == "_scatterD3_all") {
		    if (settings.col_continuous) {
			return(d3.interpolateViridis(0));
		    } else {
			return(color_scale.range()[0]);
		    }
		}
		return( color_scale(d.level));
            })
            .style("opacity", 1)
            .attr("class", function(d) {
		return "ellipse color color-c" + css_clean(d.level);
            });
    }

    // Unit circle init
    function unit_circle_init(selection) {
        selection
            .attr('cx', x(0))
            .attr('cy', y(0))
            .attr('rx', x(1)-x(0))
            .attr('ry', y(0)-y(1))
            .style("stroke", "#888")
            .style("fill", "none")
            .style("opacity", "1");
    }

    // Initial text label attributes
    function label_init (selection) {
        selection
            .attr("text-anchor", "middle");
    }

    // Compute default vertical offset for labels
    function default_label_dy(size, y, type_var) {
        if (y < 0 && type_var !== undefined && type_var == "arrow") {
            return (Math.sqrt(size) / 2) + settings.labels_size + 2;
        }
        else {
            return (-Math.sqrt(size) / 2) - 6;
        }
    }

    // Apply format to text label
    function label_formatting (selection) {
        var sel = selection
            .text(function(d) {return(d.lab);})
            .style("font-size", settings.labels_size + "px")
            .attr("class", function(d,i) { return "point-label color color-c" + css_clean(d.col_var) + " symbol symbol-c" + css_clean(d.symbol_var); })
            .attr("transform", translation)
            .style("fill", function(d) { return color_scale(d.col_var); })
            .attr("dx", function(d) {
		if (d.lab_dx === undefined) return("0px");
		else return(d.lab_dx + "px");
            })
            .attr("dy", function(d) {
		if (d.lab_dy !== undefined) return(d.lab_dy + "px");
		var size = (d.size_var === undefined) ? settings.point_size : size_scale(d.size_var);
		return default_label_dy(size, d.y, d.type_var) + "px";
            });
        if (settings.opacity_changed || settings.subset_changed || settings.redraw) {
            sel = sel.style("opacity", 1);
        }
        return sel;
    }

    // Text labels dragging function
    var dragging = false;
    drag = d3.drag()
	.subject(function(d) {
            var size = (d.size_var === undefined) ? settings.point_size : size_scale(d.size_var);
            var dx = (d.lab_dx === undefined) ? 0 : d.lab_dx;
            var dy = (d.lab_dx === undefined) ? default_label_dy(size, d.y, d.type_var) : d.lab_dy;
            return {x:x(d.x)+dx, y:y(d.y)+dy};
	})
	.on('start', function(d) {
	    if (!d3.event.sourceEvent.shiftKey) {
		dragging = true;
		d3.select(this).style('fill', '#000');
		var chart = d3.select(this).node().parentNode;
		var size = (d.size_var === undefined) ? settings.point_size : size_scale(d.size_var);
		var dx = (d.lab_dx === undefined) ? 0 : d.lab_dx;
		var dy = (d.lab_dx === undefined) ? default_label_dy(size, d.y, d.type_var) : d.lab_dy;
		d3.select(chart).append("svg:line")
		    .attr("id", "scatterD3-drag-line")
		    .attr("x1", x(d.x)).attr("x2", x(d.x) + dx)
		    .attr("y1", y(d.y)).attr("y2", y(d.y) + dy)
		    .style("stroke", "#000")
		    .style("opacity", 0.3);
	    }
	})
	.on('drag', function(d) {
	    if (dragging) {
		cx = d3.event.x - x(d.x);
		cy = d3.event.y - y(d.y);
		d3.select(this)
		    .attr('dx', cx + "px")
		    .attr('dy', cy + "px");
		d3.select("#scatterD3-drag-line")
		    .attr('x2', x(d.x) + cx)
		    .attr("y2", y(d.y) + cy);
		d.lab_dx = cx;
		d.lab_dy = cy;
	    }
	})
	.on('end', function(d) {
	    if (dragging){
		d3.select(this).style('fill', color_scale(d.col_var));
		d3.select("#scatterD3-drag-line").remove();
		dragging = false;
	    }
	});



    // Lasso functions to execute while lassoing
    var lasso_start = function() {
        lasso.items()
            .each(function(d){
		if (d3.select(this).classed('dot')) {
                    d.scatterD3_lasso_dot_stroke = d.scatterD3_lasso_dot_stroke ? d.scatterD3_lasso_dot_stroke : d3.select(this).style("stroke");
                    d.scatterD3_lasso_dot_fill = d.scatterD3_lasso_dot_fill ? d.scatterD3_lasso_dot_fill : d3.select(this).style("fill");
                    d.scatterD3_lasso_dot_opacity = d.scatterD3_lasso_dot_opacity ? d.scatterD3_lasso_dot_opacity : d3.select(this).style("opacity");
		}
		if (d3.select(this).classed('arrow')) {
                    d.scatterD3_lasso_arrow_stroke = d.scatterD3_lasso_arrow_stroke ? d.scatterD3_lasso_arrow_stroke : d3.select(this).style("stroke");
                    d.scatterD3_lasso_arrow_fill = d.scatterD3_lasso_arrow_fill ? d.scatterD3_lasso_arrow_fill : d3.select(this).style("fill");
                    d.scatterD3_lasso_arrow_opacity = d.scatterD3_lasso_arrow_opacity ? d.scatterD3_lasso_arrow_opacity : d3.select(this).style("opacity");
		}
		if (d3.select(this).classed('point-label')) {
                    d.scatterD3_lasso_text_stroke = d.scatterD3_lasso_text_stroke ? d.scatterD3_lasso_text_stroke : d3.select(this).style("stroke");
                    d.scatterD3_lasso_text_fill = d.scatterD3_lasso_text_fill ? d.scatterD3_lasso_text_fill : d3.select(this).style("fill");
                    d.scatterD3_lasso_text_opacity = d.scatterD3_lasso_text_opacity ? d.scatterD3_lasso_text_opacity : d3.select(this).style("opacity");
		}
            })
		.style("fill", null) // clear all of the fills
            .style("opacity", null) // clear all of the opacities
            .style("stroke", null) // clear all of the strokes
            .classed("not-possible-lasso", true)
            .classed("selected-lasso not-selected-lasso", false); // style as not possible
    };
    var lasso_draw = function() {
        // Style the possible dots
        lasso.items()
            .filter(function(d) {return d.possible === true;})
            .classed("not-possible-lasso", false)
            .classed("possible-lasso", true);
        // Style the not possible dot
        lasso.items().filter(function(d) {return d.possible === false;})
            .classed("not-possible-lasso", true)
            .classed("possible-lasso", false);
    };
    var lasso_end = function() {
        lasso_off(svg);
        var some_selected = false;
        if(lasso.items().filter(function(d) {return d.selected === true;}).size() !== 0){
            some_selected = true;
        }
        // Reset the color of all dots
        lasso.items()
            .style("fill", function(d) {
		if (d3.select(this).classed('point-label')) { return d.scatterD3_lasso_text_fill; }
		if (d3.select(this).classed('dot')) { return d.scatterD3_lasso_dot_fill; }
		if (d3.select(this).classed('arrow')) { return d.scatterD3_lasso_arrow_fill; }
		return null;
            })
            .style("opacity", function(d) {
		if (d3.select(this).classed('point-label')) { return d.scatterD3_lasso_text_opacity; }
		if (d3.select(this).classed('dot')) { return d.scatterD3_lasso_dot_opacity; }
		if (d3.select(this).classed('arrow')) { return d.scatterD3_lasso_arrow_opacity; }
		return null;
            })
            .style("stroke", function(d) {
		if (d3.select(this).classed('point-label')) { return d.scatterD3_lasso_text_stroke; }
		if (d3.select(this).classed('dot')) { return d.scatterD3_lasso_dot_stroke; }
		if (d3.select(this).classed('arrow')) { return d.scatterD3_lasso_arrow_stroke; }
		return null;
            });
        if (some_selected) {
            // Style the selected dots
            var sel = lasso.items().filter(function(d) {return d.selected === true;})
		.classed("not-possible-lasso possible-lasso", false)
		.classed("selected-lasso", true)
		.style("opacity", "1");

            // Reset the style of the not selected dots
            lasso.items().filter(function(d) {return d.selected === false;})
		.classed("not-possible-lasso possible-lasso", false)
		.classed("not-selected-lasso", true)
		.style("opacity", function(d) { return settings.point_opacity / 7; });

            // Call custom callback function
            var callback_sel = svg.selectAll(".dot, .arrow").filter(function(d) {return d.selected === true;});
            if (typeof settings.lasso_callback === 'function') settings.lasso_callback(callback_sel);
        }
        else {
            lasso.items()
		.classed("not-possible-lasso possible-lasso not-selected-lasso selected-lasso", false)
		.style("opacity", function(d) {
                    if (d3.select(this).classed('point-label')) {return 1;};
		    return d.opacity_var !== undefined ? opacity_scale(d.opacity_var) : settings.point_opacity;
		});
        }
    };
    lasso_classes = ".dot, .arrow, .point-label";
    // Define the lasso
    lasso_base = d3.lasso()
	.closePathDistance(2000)   // max distance for the lasso loop to be closed
	.closePathSelect(true)     // can items be selected by closing the path?
	.hoverSelect(true)         // can items by selected by hovering over them?
	.on("start", lasso_start)   // lasso start function
	.on("draw", lasso_draw)     // lasso draw function
	.on("end", lasso_end);      // lasso end function

    // Toggle lasso on / zoom off
    function lasso_on(svg) {
        // Disable zoom behavior
        root.on(".zoom", null);
        // Enable lasso
        lasso = lasso_base
            .area(root)
            .items(chart_body.selectAll(lasso_classes));
        root.call(lasso);
        // Change cursor style
        root.style("cursor", "crosshair");
        // Change togglers state
        var menu_entry = d3.select("#scatterD3-menu-" + settings.html_id + " .lasso-entry");
        var custom_entry = d3.select("#" + settings.dom_id_lasso_toggle);
        if (!menu_entry.empty()) {
            menu_entry.classed("active", true)
		.html("Toggle lasso off");
        }
        if (!custom_entry.empty()) { custom_entry.classed("active", true); }
    }

    // Toggle lasso off / zoom on
    function lasso_off(svg) {
        // Disable lasso
        root.on(".dragstart", null);
        root.on(".drag", null);
        root.on(".dragend", null);
        // Enable zoom
        root.call(zoom);
        // Change cursor style
        root.style("cursor", "move");
        // Change togglers state
        var menu_entry = d3.select("#scatterD3-menu-" + settings.html_id + " .lasso-entry");
        var custom_entry = d3.select("#" + settings.dom_id_lasso_toggle);
        if (!menu_entry.empty()) {
            menu_entry.classed("active", false)
		.html("Toggle lasso on");
        }
        if (!custom_entry.empty()) { custom_entry.classed("active", false); }
    }

    // Toggle lasso state when element clicked
    function lasso_toggle() {
        var menu_entry = d3.select("#scatterD3-menu-" + settings.html_id + " .lasso-entry");
        var custom_entry = d3.select("#" + settings.dom_id_lasso_toggle);
        if (settings.lasso &&
            ((!menu_entry.empty() && menu_entry.classed("active")) ||
             (!custom_entry.empty() && custom_entry.classed("active")))) {
            lasso_off(svg);
        }
        else {
            lasso_on(svg);
        }
    }

    // Format legend label
    function legend_label_formatting (selection, margin_top) {
        selection
            .style("text-anchor", "beginning")
            .style("fill", "#000")
            .style("font-weight", "bold");
    }

    // Create color legend
    function add_color_legend() {

        var legend = svg.select(".legend")
            .style("font-size", settings.legend_font_size);

	if (!settings.col_continuous) {
	    var legend_color_domain = color_scale.domain().sort();
            var n = d3.map(data, function(d) { return d.col_var; }).size();
            var legend_color_scale = n <= 9 ? d3.scaleOrdinal(custom_scheme10) : d3.scaleOrdinal(d3.schemeCategory20);
	    legend_color_scale
		.domain(legend_color_domain)
		.range(legend_color_domain.map(function(d) {return color_scale(d);}));
	} else {
	    legend_color_scale = color_scale;
	}


        var color_legend = d3.legendColor()
            .shapePadding(3)
            .shape("rect")
            .scale(legend_color_scale);

	if (!settings.col_continuous) {
	    color_legend
		.on("cellover", function(d) {
		    d = css_clean(d);
		    var nsel = ".color:not(.color-c" + d + "):not(.selected-lasso):not(.not-selected-lasso)";
		    var sel = ".color-c" + d + ":not(.selected-lasso):not(.not-selected-lasso)";
		    svg.selectAll(nsel)
			.transition()
			.style("opacity", 0.2);
		    svg.selectAll(sel)
			.transition()
			.style("opacity", 1);
		})
		.on("cellout", function(d) {
		    var sel = ".color:not(.selected-lasso):not(.not-selected-lasso)";
		    svg.selectAll(sel)
			.transition()
			.style("opacity", function(d2) {
			    return(d2.opacity_var === undefined ? settings.point_opacity : opacity_scale(d2.opacity_var));
			});
		    svg.selectAll(".point-label:not(.selected-lasso):not(.not-selected-lasso)")
			.transition()
			.style("opacity", 1);
		});
	} else {
	    color_legend.cells(6);
	}

        legend.append("g")
            .append("text")
            .attr("class", "color-legend-label")
            .attr("transform", "translate(" + dims.legend_x + "," + margin.legend_top + ")")
            .text(settings.col_lab)
            .call(legend_label_formatting);

        legend.append("g")
            .attr("class", "color-legend")
            .attr("transform", "translate(" + dims.legend_x + "," + (margin.legend_top + 8) + ")")
            .call(color_legend);
    }

    // Create symbol legend
    function add_symbol_legend() {

        var legend = svg.select(".legend");

        // Height of color legend
	var color_legend_height = 0;
	if (settings.has_color_var) {
	    var n = settings.col_continuous ? 6 : color_scale.domain().length;
	    color_legend_height = n * 20 + 30;
	}
        margin.symbol_legend_top = color_legend_height + margin.legend_top;

        var legend_symbol_domain = symbol_scale.domain().sort();
        var legend_symbol_scale = d3.scaleOrdinal()
            .domain(legend_symbol_domain)
            .range(legend_symbol_domain.map(function(d) {return d3.symbol().type(d3.symbols[symbol_scale(d)])();}));

        var symbol_legend = d3.legendSymbol()
            .shapePadding(5)
            .scale(legend_symbol_scale)
            .on("cellover", function(d) {
		d = css_clean(d);
		var nsel = ".symbol:not(.symbol-c" + d + "):not(.selected-lasso):not(.not-selected-lasso)";
		var sel = ".symbol-c" + d + ":not(.selected-lasso):not(.not-selected-lasso)";
		svg.selectAll(nsel)
		    .transition()
		    .style("opacity", 0.2);
		svg.selectAll(sel)
		    .transition()
		    .style("opacity", 1);
            })
            .on("cellout", function(d) {
		var sel = ".symbol:not(.selected-lasso):not(.not-selected-lasso)";
		svg.selectAll(sel)
		    .transition()
		    .style("opacity", function(d2) {
			return(d2.opacity_var === undefined ? settings.point_opacity : opacity_scale(d2.opacity_var));
		    });
		svg.selectAll(".point-label:not(.selected-lasso):not(.not-selected-lasso)")
		    .transition()
		    .style("opacity", 1);
            });

        legend.append("g")
            .append("text")
            .attr("class", "symbol-legend-label")
            .attr("transform", "translate(" + dims.legend_x + "," + margin.symbol_legend_top + ")")
            .text(settings.symbol_lab)
            .call(legend_label_formatting);

        legend.append("g")
            .attr("class", "symbol-legend")
            .attr("transform", "translate(" + (dims.legend_x + 8) + "," + (margin.symbol_legend_top + 14) + ")")
            .call(symbol_legend);

    }

    // Create size legend
    function add_size_legend() {

        var legend = svg.select(".legend");

        // Height of color and symbol legends
	        // Height of color legend
	var color_legend_height = 0;
	if (settings.has_color_var) {
	    var n = settings.col_continuous ? 6 : color_scale.domain().length;
	    color_legend_height = n * 20 + 30;
	}
        var symbol_legend_height = settings.has_symbol_var ? symbol_scale.domain().length * 20 + 30 : 0;
        margin.size_legend_top = color_legend_height + symbol_legend_height + margin.legend_top;

        var legend_size_scale = d3.scaleLinear()
            .domain(size_scale.domain())
        // FIXME : find exact formula
            .range(size_scale.range().map(function(d) {return Math.sqrt(d)/1.8;}));

        var size_legend = d3.legendSize()
            .shapePadding(3)
            .shape('circle')
            .scale(legend_size_scale);

        legend.append("g")
            .append("text")
            .attr("class", "size-legend-label")
            .attr("transform", "translate(" + dims.legend_x + "," + margin.size_legend_top + ")")
            .text(settings.size_lab)
            .call(legend_label_formatting);

        legend.append("g")
            .attr("class", "size-legend")
            .attr("transform", "translate(" + (dims.legend_x + 8) + "," + (margin.size_legend_top + 14) + ")")
            .call(size_legend);

    }


    // Filter points and arrows data
    function point_filter(d) {
	return d.type_var === undefined || d.type_var == "point";
    }
    function arrow_filter(d) {
	return d.type_var !== undefined && d.type_var == "arrow";
    }


    function chart(selection) {
        selection.each(function() {

            setup_sizes();
            setup_scales();

            // Root chart element and axes
            root = svg.append("g")
		.attr("class", "root")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(zoom);

            root.append("rect")
		.style("fill", "#FFF")
		.attr("width", dims.width)
		.attr("height", dims.height);

            root.call(add_axes);

            // <defs>
            var defs = svg.append("defs");
            // arrow head markers
	    if (!settings.col_continuous) {
		color_scale.range().forEach(function(d) {
                    defs.append("marker")
			.attr("id", "arrow-head-" + settings.html_id + "-" + d)
			.attr("markerWidth", "10")
			.attr("markerHeight", "10")
			.attr("refX", "10")
			.attr("refY", "4")
			.attr("orient", "auto")
			.append("path")
			.attr("d", "M0,0 L0,8 L10,4 L0,0")
			.style("fill", d);
		});
            }

            // chart body
            chart_body = root.append("svg")
		.attr("class", "chart-body")
		.attr("width", dims.width)
		.attr("height", dims.height);

	    // lines
	    if (settings.lines !== null) {
		var lines = chart_body
		    .selectAll(".lines")
		    .data(HTMLWidgets.dataframeToD3(settings.lines));
		lines.enter()
		    .append("path")
		    .call(line_init)
		    .call(line_formatting);
	    }


            // Unit circle
            if (settings.unit_circle) {
		var unit_circle = chart_body.append('svg:ellipse')
		    .attr('class', 'unit-circle')
		    .call(unit_circle_init);
            }

            // Add points
            var dot = chart_body
		.selectAll(".dot")
		.data(data.filter(point_filter), key);
            dot.enter()
		.append("path")
		.call(dot_init)
		.call(dot_formatting);
            // Add arrows
            var arrow = chart_body
		.selectAll(".arrow")
		.data(data.filter(arrow_filter), key);
            arrow.enter()
		.append("svg:line")
		.call(arrow_init)
		.call(arrow_formatting);

            // Add ellipses
            if (settings.ellipses) {
		var ellipse = chart_body
		    .selectAll(".ellipse")
		    .data(settings.ellipses_data);
		ellipse.enter()
		    .append("svg:path")
		    .call(ellipse_init)
		    .call(ellipse_formatting);
            }

            // Add text labels
            if (settings.has_labels) {
                var labels = chart_body.selectAll(".point-label")
                    .data(data, key);

                labels.enter()
                    .append("text")
                    .call(label_init)
                    .call(label_formatting)
                    .call(drag);
            }

            // Legends
            if (settings.has_legend && settings.legend_width > 0) {
                var legend = svg.append("g").attr("class", "legend");
                // Color legend
                if (settings.has_color_var) {
                    add_color_legend.svg = svg;
                    add_color_legend(legend);
                }
                // Symbol legend
                if (settings.has_symbol_var) {
                    add_symbol_legend.svg = svg;
                    add_symbol_legend(legend);
                }
                // Size legend
                if (settings.has_size_var) add_size_legend(legend);
            }

            // Tools menu
            if(settings.menu) {

		// Gear icon
		gear = svg.append("g")
		    .attr("class", "gear-menu")
		    .attr("transform", "translate(" + (width - 36) + ", 6)");
		gear.append("rect")
		    .attr("class", "gear-toggle")
		    .attr("width", "25")
		    .attr("height", "25")
		    .style("fill", "#FFFFFF");
		gear.append("path")
		    .attr("d", gear_path)
		    .attr("transform", "translate(-3,3)")
		    .style("fill", "#666666");

		var menu_parent = d3.select(svg.node().parentNode);
		menu_parent.style("position", "relative");
		var menu = menu_parent.select(".scatterD3-menu");

		menu.attr("id", "scatterD3-menu-" + settings.html_id);

		menu.append("li")
		    .append("a")
		    .on("click", reset_zoom)
		    .html("Reset zoom");

		menu.append("li")
		    .append("a")
		    .on("click", export_svg)
		    .html("Export to SVG");

		if (settings.lasso) {
                    menu.append("li")
			.append("a")
			.attr("class", "lasso-entry")
			.on("click", lasso_toggle)
			.html("Toggle lasso on");
		}

		if (settings.has_labels) {
                    menu.append("li")
			.append("a")
			.on("click", export_labels_position)
			.html("Export labels positions");
		}

		gear.on("click", function(d, i){
                    var menu = d3.select("#scatterD3-menu-" + settings.html_id);
                    var gear = svg.select(".gear-menu");
                    if (!menu.classed("open")) {
			menu.transition().duration(300)
			    .style("opacity", "0.95")
			    .style("width", "165px");
			gear.classed("selected", true);
			menu.classed("open", true);
                    } else {
			menu.transition().duration(300)
			    .style("opacity", "0")
			    .style("width", "0px");
			gear.classed("selected", false);
			menu.classed("open", false);
                    }
		});
            }

        });
    }


    // Update chart with transitions
    function update_settings(old_settings) {
        if (old_settings.labels_size != settings.labels_size)
            svg.selectAll(".point-label").transition().style("font-size", settings.labels_size + "px");
        if (old_settings.point_size != settings.point_size ||
	    old_settings.point_opacity != settings.point_opacity)
            svg.selectAll(".dot").transition().call(dot_formatting);
        if (old_settings.has_labels != settings.has_labels) {
            if (!settings.has_labels) {
                svg.selectAll(".point-label").remove();
            }
            if (settings.has_labels) {
                var labels = chart_body.selectAll(".point-label")
                    .data(data, key);
                labels.enter()
                    .append("text")
                    .call(label_init)
                    .call(label_formatting)
                    .call(drag);
            }
        }
        if (old_settings.unit_circle != settings.unit_circle) {
            if (!settings.unit_circle) {
                var circle = svg.select(".unit-circle");
                circle.transition().duration(1000).call(unit_circle_init)
                    .style("opacity", "0").remove();
            }
            if (settings.unit_circle) {
                chart_body.append('svg:ellipse')
                    .attr('class', 'unit-circle')
                    .style("opacity", "0");
            }
        }
      	if (settings.menu) {
	          var menu_parent = d3.select(svg.node().parentNode);
	          menu_parent.style("position", "relative");
	          var menu = menu_parent.select(".scatterD3-menu");
	          menu.attr("id", "scatterD3-menu-" + settings.html_id);
      	}
    };

    // Update data with transitions
    function update_data() {

	setup_scales();

	if (settings.has_legend_changed && settings.legend_width > 0) 
            resize_chart(1000);
	
	//setup_sizes();

        xAxis = xAxis.scale(x).tickSize(-dims.height);
        yAxis = yAxis.scale(y).tickSize(-dims.width);

	var t0 = root.transition().duration(1000);
	svg.select(".x-axis-label").text(settings.xlab);
	t0.select(".x.axis").call(xAxis);
	svg.select(".y-axis-label").text(settings.ylab);
	    t0.select(".y.axis").call(yAxis);
	
	t0.call(zoom.transform, d3.zoomIdentity);

	// Add lines
	if (settings.lines !== null) {
	    var line = chart_body.selectAll(".line")
		.data(HTMLWidgets.dataframeToD3(settings.lines));
	    line.enter().append("path").call(line_init)
		.style("opacity", "0")
		.merge(line)
		.transition().duration(1000)
		.call(line_formatting)
		.style("opacity", "1");
	    line.exit().transition().duration(1000).style("opacity", "0").remove();
	}

	// Unit circle
	if (settings.unit_circle) t0.select(".unit-circle").call(unit_circle_init);

	// Add points
	var dot = chart_body.selectAll(".dot")
	    .data(data.filter(point_filter), key);
	dot.enter().append("path").call(dot_init)
	    .merge(dot).transition().duration(1000).call(dot_formatting);
	dot.exit().transition().duration(1000).attr("transform", "translate(0,0)").remove();
	// Add arrows
	var arrow = chart_body.selectAll(".arrow")
	    .data(data.filter(arrow_filter), key);
	arrow.enter().append("svg:line").call(arrow_init)
	    .style("opacity", "0")
	    .merge(arrow)
	    .transition().duration(1000)
	    .call(arrow_formatting).style("opacity", "1");
	arrow.exit().transition().duration(1000).style("opacity", "0").remove();

	// Add ellipses
	if (settings.ellipses || settings.ellipses_changed) {
            var ellipse = chart_body.selectAll(".ellipse")
		.data(settings.ellipses_data);
            ellipse.enter().append("path").call(ellipse_init)
		.style("opacity", "0")
		.merge(ellipse)
		.transition().duration(1000)
		.call(ellipse_formatting).style("opacity", "1");
            ellipse.exit().transition().duration(1000).style("opacity", "0").remove();
	}

	if (settings.has_labels) {
            var labels = chart_body.selectAll(".point-label")
		.data(data, key);
            labels.enter().append("text").call(label_init).call(drag)
		.merge(labels).transition().duration(1000).call(label_formatting);
            labels.exit().transition().duration(1000).attr("transform", "translate(0,0)").remove();
	}

	if (settings.legend_changed) {

            // Remove existing legends
            svg.select(".legend").remove();
            var legend = svg.append("g").attr("class", "legend");

            // Recreate them
            if (settings.has_legend && settings.legend_width > 0) {
		// Color legend
		if (settings.has_color_var) {
                    add_color_legend.svg = svg;
                    add_color_legend(legend);
		}
		// Symbol legend
		if (settings.has_symbol_var) {
                    add_symbol_legend.svg = svg;
                    add_symbol_legend(legend);
		}
		// Size legend
		if (settings.has_size_var) add_size_legend(legend);
            }
	}

	lasso_off(svg);
    };

    // Dynamically resize chart elements
    function resize_chart (transition) {
        // recompute sizes
        setup_sizes();
        // recompute scales
        x.range([0, dims.width]);
        x_orig.range([0, dims.width]);
        y.range([dims.height, 0]);
        y_orig.range([dims.height, 0]);
        xAxis = xAxis.scale(x).tickSize(-dims.height);
        yAxis = yAxis.scale(y).tickSize(-dims.width);
	var t;
	if (transition) {
	    t = svg.transition().duration(1000);
	} else {
	    t = svg;
	}
	// Change svg attributes
        t.select(".root")
            .attr("width", dims.width)
            .attr("height", dims.height);
        t.select(".root")
	    .select("rect")
            .attr("width", dims.width)
            .attr("height", dims.height);
        t.select(".chart-body")
            .attr("width", dims.width)
            .attr("height", dims.height);
	t.select(".x.axis")
	    .attr("transform", "translate(0," + dims.height + ")")
	    .call(xAxis);
        t.select(".x-axis-label")
	    .attr("transform", "translate(" + (dims.width - 5) + "," + (dims.height - 6) + ")");
	t.select(".y.axis")
		.call(yAxis);
	if (settings.unit_circle) {
            t.select(".unit-circle")
		.call(unit_circle_init);
	}
	if (!transition) {
	    t.select(".root").call(zoom.transform,
		      d3.zoomTransform(svg.select(".root").node()));
	}

        // Move legends
        if (settings.has_color_var) {
            t.select(".color-legend-label")
		.attr("transform", "translate(" + dims.legend_x + "," + margin.legend_top + ")");
            t.select(".color-legend")
		.attr("transform", "translate(" + dims.legend_x + "," + (margin.legend_top + 12) + ")");
        }
        if (settings.has_symbol_var) {
            t.select(".symbol-legend-label")
		.attr("transform", "translate(" + dims.legend_x + "," + margin.symbol_legend_top + ")");
            t.select(".symbol-legend")
		.attr("transform", "translate(" + (dims.legend_x + 8) + "," + (margin.symbol_legend_top + 14) + ")");
        }
        if (settings.has_size_var) {
            t.select(".size-legend-label")
		.attr("transform", "translate(" + dims.legend_x + "," + margin.size_legend_top + ")");
            t.select(".size-legend")
		.attr("transform", "translate(" + (dims.legend_x + 8) + "," + (margin.size_legend_top + 14) + ")");
        }
        // Move menu
        if (settings.menu) {
            t.select(".gear-menu")
		.attr("transform", "translate(" + (width - 40) + "," + 10 + ")");
        }

    };


    // Add controls handlers for shiny
    chart.add_controls_handlers = function() {
        // Zoom reset
        d3.select("#" + settings.dom_id_reset_zoom)
            .on("click", reset_zoom);

        // SVG export
        d3.select("#" + settings.dom_id_svg_export)
            .on("click", export_svg);

        // Lasso toggle
        d3.select("#" + settings.dom_id_lasso_toggle)
            .on("click", lasso_toggle);
    };

    chart.add_global_listeners = function() {
	// Toogle zoom and lasso behaviors when shift is pressed
	var parent = d3.select("#scatterD3-svg-" + settings.html_id).node().parentNode;
	d3.select(parent)
	    .attr("tabindex", 0)
	    .on("keydown", function() {
		var key = d3.event.key !== undefined ? d3.event.key : d3.event.keyIdentifier;
		if (key == "Shift") {
		    if (settings.lasso) {
			lasso_on(svg);
		    }
		}
	    })
	    .on("keyup", function() {
		var key = d3.event.key !== undefined ? d3.event.key : d3.event.keyIdentifier;
		if (key == "Shift") {
		    if (settings.lasso) {
			lasso_off(svg);
		    }
		}
	    });

    };

    // resize
    chart.resize = function() {
        resize_chart();
    };

    // settings getter/setter
    chart.data = function(value, redraw) {
        if (!arguments.length) return data;
        data = value;
        if (!redraw) update_data();
        return chart;
    };

    // settings getter/setter
    chart.settings = function(value) {
        if (!arguments.length) return settings;
        if (Object.keys(settings).length === 0) {
            settings = value;
        } else {
            var old_settings = settings;
            settings = value;
            update_settings(old_settings);
        }
        return chart;
    };

    chart.svg = function(value) {
        if (!arguments.length) return svg;
        svg = value;
        return chart;
    };

    // width getter/setter
    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    // height getter/setter
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    return chart;
}



HTMLWidgets.widget({

    name: 'scatterD3',

    type: 'output',

    factory: function(el, width, height) {

        if (width < 0) width = 0;
        if (height < 0) height = 0;
        // Create root svg element
        var svg = d3.select(el).append("svg");
        svg
            .attr("width", width)
            .attr("height", height)
            .attr("class", "scatterD3")
            .append("style")
            .text(".scatterD3 {font: 11px Open Sans, Droid Sans, Helvetica, Verdana, sans-serif;}" +
		  ".scatterD3 .axis line, .axis path { stroke: #000; fill: none; shape-rendering: CrispEdges;} " +
		  ".scatterD3 .axis .tick line { stroke: #ddd;} " +
		  ".scatterD3 .axis text { fill: #000; }");

        // Create tooltip content div
        var tooltip = d3.select(".scatterD3-tooltip");
        if (tooltip.empty()) {
            tooltip = d3.select("body")
		.append("div")
		.style("visibility", "hidden")
		.attr("class", "scatterD3-tooltip");
        }

        // Create menu div
        var menu = d3.select(el).select(".scatterD3-menu");
        if (menu.empty()) {
            menu = d3.select(el).append("ul")
		.attr("class", "scatterD3-menu");
        }

        // Create scatterD3 instance
        var scatter = scatterD3().width(width).height(height).svg(svg);

	return({
            resize: function(width, height) {

		if (width < 0) width = 0;
		if (height < 0) height = 0;
		// resize root svg element
		var svg = d3.select(el).select("svg");
		svg
		    .attr("width", width)
		    .attr("height", height);
		// resize chart
		scatter.width(width).height(height).svg(svg).resize();
            },

            renderValue: function(obj) {
		// Check if update or redraw
		var first_draw = (Object.keys(scatter.settings()).length === 0);
		var redraw = first_draw || !obj.settings.transitions;
		var svg = d3.select(el).select("svg").attr("id", "scatterD3-svg-" + obj.settings.html_id);
		scatter = scatter.svg(svg);

		// convert data to d3 format
		data = HTMLWidgets.dataframeToD3(obj.data);

		// If no transitions, remove chart and redraw it
		if (!obj.settings.transitions) {
                    svg.selectAll("*:not(style)").remove();
		    menu.selectAll("li").remove();
		}

		// Complete draw
		if (redraw) {
                    scatter = scatter.data(data, redraw);
                    obj.settings.redraw = true;
                    scatter = scatter.settings(obj.settings);
                    // add controls handlers and global listeners for shiny apps
                    scatter.add_controls_handlers();
                    scatter.add_global_listeners();
                    // draw chart
                    d3.select(el)
			.call(scatter);
		}
		// Update only
		else {
		    // Array equality test
		    function array_equal (a1, a2) {
			return a1.length == a2.length && a1.every(function(v,i) { return v === a2[i]});
		    }

                    // Check what did change
                    obj.settings.has_legend_changed = scatter.settings().has_legend != obj.settings.has_legend;
                    obj.settings.has_labels_changed = scatter.settings().has_labels != obj.settings.has_labels;
                    obj.settings.size_range_changed = !array_equal(scatter.settings().size_range, obj.settings.size_range);
                    obj.settings.ellipses_changed = scatter.settings().ellipses != obj.settings.ellipses;
                    function changed(varname) {
			return obj.settings.hashes[varname] != scatter.settings().hashes[varname];
                    };
                    obj.settings.x_changed = changed("x");
                    obj.settings.y_changed = changed("y");
                    obj.settings.lab_changed = changed("lab");
                    obj.settings.legend_changed = changed("col_var") || changed("symbol_var") ||
			changed("size_var") || obj.settings.size_range_changed;
                    obj.settings.data_changed = obj.settings.x_changed || obj.settings.y_changed ||
			obj.settings.lab_changed || obj.settings.legend_changed ||
			obj.settings.has_labels_changed || changed("ellipses_data") ||
			obj.settings.ellipses_changed || changed("opacity_var") ||
			changed("lines");
                    obj.settings.subset_changed = changed("key_var");
                    scatter = scatter.settings(obj.settings);
                    // Update data only if needed
                    if (obj.settings.data_changed) scatter = scatter.data(data, redraw);
		}
            },

            s: scatter
	});
    }
});
