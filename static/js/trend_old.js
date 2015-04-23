var ball_radius, bar_pos, chart, color, format, formatNumber, height, hist_height, margin, render_topic, root, timeline, timeline_item_offset, width;
root = void 0;
margin = {
    top: 1,
    right: 1,
    bottom: 6,
    left: 1
};
width = 1500;
height = 800 - margin.top - margin.bottom;
formatNumber = d3.format(",.0f");
format = function (d) {
    return formatNumber(d) + " Times";
};
color = d3.scale.category20();
chart = d3.select("#chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
timeline;
bar_pos = 170;
timeline_item_offset = 20;
ball_radius = 6;
hist_height = 100;
d3.select("head").append("script").attr("type", "text/javascript").attr("src", "/static/js/sankey.js");
d3.select(window).on('resize', function () {
    return render_topic("big data", 1, 1000);
});
d3.select('#trend').on('click', function () {
    return render_topic("big data", 1, 1000);
});
render_topic = function (q, start, end) {
    var area, path, sankey, svg, y;
    sankey = d3.sankey().nodeWidth(0).nodePadding(0).size([width, 330]);
    path = sankey.link();
    area = d3.svg.area().x(function (d) {
        return d.x;
    }).y0(function (d) {
        return d.y0;
    }).y1(function (d) {
        return d.y1;
    });
    y = d3.scale.linear().range([height, 0]);
    chart.remove();
    chart = d3.select("#chart").append("svg").attr("overflow", "scroll").attr("id", "dark").attr("width", width).attr("height", height + margin.top + margin.bottom).attr("transform", "translate(" + 70 + "," + 25 + ")");
    chart.append("linearGradient").attr("id", "xiangyu");
    timeline = d3.select("#right-box").append("svg").attr("overflow", "scroll");
    svg = chart.append("g").attr("height", 350).attr("id", "trend");
    svg.on("mousewheel", function () {
    });
    svg.append("line").attr("id", "nvMouse").attr("class", "hidden").style("stroke", "red").style("stroke-width", 5);
    chart.append("line").attr("x1", 0).attr("x2", width).attr("y1", 330).attr("y2", 330).attr("id", "cutline").style("stroke", "darkgray").style("stroke-width", 1);
    $("#chart").addClass("loading");
    d3.json("/static/js/trend_out.json", function (energy) {
        var axis, basis, draw_flow, draw_right_box, flow, force, item, link, max_freq, max_sum, node, people, terms, time_slides_dict, time_slides_offset, time_window, x;
        $("#chart").removeClass("loading");
        terms = {};
        max_sum = 0;
        energy.terms.forEach(function (t) {
            t.sum = 0;
            t.year.forEach(function (tt) {
                if ((tt.y > 2010) && (tt.d > 0)) {
                    t.sum += tt.d;
                }
            });
            if (t.sum > max_sum) {
                max_sum = t.sum;
            }
            terms[t.t] = t;
        });
        people = {};
        energy.people.forEach(function (t) {
            people[t.id] = t;
        });
        timeline.attr("height", function (d) {
            return 25 * energy.terms.length;
        });
        timeline.append("line").attr("x1", bar_pos + 10).attr("x2", bar_pos + 10).attr("y1", 0).attr("y2", function () {
            return 25 * energy.terms.length;
        }).style("stroke", "gray").style("stroke-width", .5);
        max_freq = 0;
        energy.terms.forEach(function (d) {
            if (d.freq > max_freq) {
                max_freq = d.freq;
            }
        });
        d3.select("#nav").style("display", "");
        d3.select(".active").classed("active", false);
        d3.select($("#first-three").parent()[0]).classed("active", "true");
        draw_right_box = function () {
            var hist;
            energy.terms.sort(function (a, b) {
                return b.sum - a.sum;
            });
            hist = timeline.append("g").selectAll(".term").data(energy.terms).enter().append("g").attr("class", "term").attr("transform", function (d, i) {
                return "translate(" + [0, i * timeline_item_offset + 20] + ")rotate(" + 0 + ")";
            }).attr("id", function (d) {
                return "term-" + d.idx;
            }).on("click", function (d) {
                draw_flow(d);
            });
            hist.append("rect").attr("x", function (d) {
                return bar_pos + 10;
            }).attr("y", function (d) {
                return 0;
            }).attr("height", 18).attr("width", function (d) {
                return hist_height * d.sum / max_sum;
            }).style("fill-opacity", 0.7).style("fill", "#60aFe9").append("svg:title").text(function (d) {
                return d.sum;
            });
            hist.append("text").attr("text-anchor", "end").attr("transform", function (d) {
                return "translate(" + [bar_pos, 0] + ")rotate(" + 0 + ")";
            }).style("font-size", 12).attr("dy", ".85em").text(function (d) {
                return d.t;
            });
        };
        draw_right_box();
        d3.select("#first-three").on("click", function (e) {
            d3.select(".active").classed("active", false);
            d3.select(this.parentNode).classed("active", true);
            d3.selectAll(".term").remove();
            energy.terms.sort(function (a, b) {
                return b.freq - a.freq;
            });
            draw_right_box();
            draw_flow(terms[q]);
        });
        d3.select("#revert").on("click", function (e) {
            var hist;
            d3.select(".active").classed("active", false);
            d3.select(this.parentNode).classed("active", "true");
            d3.selectAll(".term").remove();
            energy.terms.sort(function (a, b) {
                return b.freq - a.freq;
            });
            hist = timeline.append("g").selectAll(".term").data(energy.terms).enter().append("g").attr("class", "term").attr("id", function (d) {
                return "term-" + d.idx;
            }).attr("transform", function (d, i) {
                return "translate(" + [0, i * timeline_item_offset + 20] + ")rotate(" + 0 + ")";
            }).on("click", function (d) {
                draw_flow(d);
            });
            hist.append("rect").attr("x", function (d) {
                return bar_pos + 10;
            }).attr("y", function (d) {
                return 0;
            }).attr("height", 18).attr("width", function (d) {
                return hist_height * d.freq / max_freq;
            }).style("fill-opacity", 0.7).style("fill", "#60aFe9").append("svg:title").text(function (d) {
                return d.sum;
            });
            hist.append("text").attr("text-anchor", "end").attr("transform", function (d) {
                return "translate(" + [bar_pos, 0] + ")rotate(" + 0 + ")";
            }).style("font-size", 12).attr("dy", ".85em").text(function (d) {
                return d.t;
            });
            draw_flow(terms[q]);
        });
        time_slides_dict = {};
        time_slides_offset = {};
        energy.time_slides.forEach(function (time, i) {
            time.sort();
            time.forEach(function (year, j) {
                time_slides_dict[year] = i;
                time_slides_offset[year] = j;
            });
        });
        time_window = energy.time_slides[0].length;
        x = function (year) {
            return (time_slides_dict[year] + ((1 / time_window) * time_slides_offset[year])) * width / energy.time_slides.length;
        };
        axis = svg.append("g").selectAll(".axis").data(energy.time_slides).enter().append("g").attr("class", "axis").attr("transform", function (d, i) {
            return "translate(" + i * width / energy.time_slides.length + "," + 0 + ")";
        });
        axis.append("line").attr("x1", function (d) {
            return 0;
        }).attr("x2", function (d) {
            return 0;
        }).attr("y1", function (d) {
            return 0;
        }).attr("y2", function (d) {
            return 600;
        }).style("stroke", function (d) {
            return "lightgray";
        }).style("stroke-width", function (d) {
            return 1;
        });
        axis.append("text").attr("x", -6).attr("y", 10).attr("dy", ".0em").attr("text-anchor", "end").attr("transform", null).text(function (d, i) {
            return d3.min(d);
        }).attr("x", 6).attr("text-anchor", "start").style("font-weight", "bold");
        sankey.nodes(energy.nodes).links(energy.links).items(energy.terms).nodeOffset(width / energy.time_slides.length).layout(300);
        root = energy.links;
        link = svg.append("g").selectAll(".link").data(energy.links).enter().append("path").attr("class", function (d) {
            return "link " + d.source_index + "-" + d.target_index;
        }).attr("d", path).style("stroke-width", function (d) {
            return 20;
        }).style("fill-opacity", .6).style("fill", function (d) {
            var key;
            key = "gradient-" + d.source_index + "-" + d.target_index;
            svg.append("linearGradient").attr("id", key).attr("gradientUnits", "userSpaceOnUse").attr("x1", d.source.x + 50).attr("y1", 0).attr("x2", d.target.x).attr("y2", 0).selectAll("stop").data([
                {
                    offset: "0%",
                    color: color(d.source.cluster)
                }, {
                    offset: "100%",
                    color: color(d.target.cluster)
                }
            ]).enter().append("stop").attr("offset", function (d) {
                return d.offset;
            }).attr("stop-color", function (d) {
                return d.color;
            });
            return d.color = "url(#" + key + ")";
        }).sort(function (a, b) {
            return b.dy - a.dy;
        }).on("mouseover", function () {
            d3.select(this).attr("opacity", .6);
        }).on("mouseout", function () {
            d3.select(this).transition().duration(250).attr("opacity", function () {
                return 1;
            });
        }).on("click", function (d) {
        });
        link.append("title").text(function (d) {
            return d.source.name + " → " + d.target.name + d.source_index;
        });
        force = d3.layout.force();
        force.nodes(energy.nodes).gravity(.1).charge(function (d) {
            if (d.dy < 10) {
                return -(d.dy * 10);
            } else {
                return -(d.dy * 4);
            }
        }).size([width, 330]).start();
        node = svg.append("g").selectAll(".node").data(energy.nodes).enter().append("a").attr("href", "#").attr("class", "popup").attr("rel", "popuprel").append("g").attr("class", "node").call(force.drag).on("mouseover", function (d, event) {
            var xPosition, yPosition;
            d3.select(this).attr("opacity", .6);
            xPosition = d3.event.layerX + 50;
            yPosition = d3.event.layerY + 30;
            if (xPosition > 900) {
                xPosition = d3.event.layerX - 200;
            }
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(function () {
                return d.name + "：  " + format(d.value) + " " + d.y;
            });
            d3.select("#tooltip").classed("hidden", false);
        }).on("mouseout", function () {
            d3.select(this).transition().duration(400).attr("opacity", function () {
                return 1;
            });
            d3.select("#tooltip").classed("hidden", true);
        }).on("click", function (d) {
            $('#myModal').modal('show');
            d3.select("#detailInfo").text(function () {
                return d.name + "：  " + format(d.value) + "\n";
            });
        });
        node.append("a").attr("class", "border-fade").append("rect").attr("height", function (d) {
            return d.dy;
        }).attr("width", sankey.nodeWidth()).style("fill", function (d) {
            return d.color = color(d.cluster);
        }).style("stroke", function (d) {
            return d.color;
        }).style("stroke-width", function (d) {
            return 0;
        }).style("opacity", function (d) {
            return 0.6;
        });
        node.append("circle").attr("cy", function (d) {
            return (d.dy / 2) + 5;
        }).attr("r", 5).attr("stroke", "black").attr("stroke-width", 1).attr("fill", "red");
        node.append("text").attr("x", -20).attr("y", function (d) {
            return d.dy / 2;
        }).attr("text-anchor", "middle").attr("transform", null).text(function (d) {
            return d.name;
        }).style("fill", function (d) {
            return "black";
        }).style("font-weight", "bold").style("font", function (d) {
            var w;
            w = d.w;
            if (w > 15) {
                w = 15;
            }
            if (w < 10 && w > 0) {
                w = 10;
            }
            return w + "px sans-serif";
        });
        energy.terms.sort(function (a, b) {
            return b.start.year - a.start.year;
        });
        force.on("tick", function () {
            node.attr("transform", function (d) {
                d.x = d.pos * (width / energy.time_slides.length);
                return "translate(" + d.x + "," + d.y + ")";
            });
            sankey.relayout();
            link.attr("d", path);
        });
        item = svg.append("g").selectAll(".item").data(energy.terms).enter().append("g").attr("class", "item").attr("transform", function (d) {
            return "translate(" + x(d.start.year) + "," + (d.start.node.y + d.start.node.dy / 2) + ")";
        });
        item.append("circle").attr("cx", function (d) {
            return 0;
        }).attr("cy", function (d) {
            return 0;
        }).attr("r", function (d) {
            return d.freq / 10;
        }).style("stroke-width", 1).style("stroke", function (d) {
            return color(d.start.cluster);
        }).style("stroke-opacity", .5).style("fill", function (d) {
            return color(d.start.cluster);
        }).style("display", "none");
        basis = d3.svg.area().x(function (d, i) {
            return x(d.y);
        }).y0(function (d) {
            if (d.d < 30) {
                return 200 - d.d * 5;
            }
            return 50;
        }).y1(function (d) {
            if (d.d < 30) {
                return 200 + d.d * 5;
            }
            return 350;
        }).interpolate("basis");
        flow = chart.append("g").attr("transform", function (d) {
            return "translate(" + [0, 350] + ")rotate(" + 0 + ")";
        });
        draw_flow = function (data) {
            var channels, count, i, people_flow;
            flow.remove();
            flow = chart.append("g").attr("transform", function (d) {
                return "translate(" + [0, 350] + ")rotate(" + 0 + ")";
            });
            d3.select(".strong").remove();
            d3.select("#term-" + data.idx).append("rect").attr("class", "strong").attr("x", "0px").attr("y", function (d) {
                return -1.8125;
            }).attr("width", "300px").attr("height", function (d) {
                return 19.8125;
            }).style("fill", "#9900FF").style("fill-opacity", 0.2);
            flow.append("path").attr("d", function (d) {
                return basis(data.year);
            }).style("stroke-width", 0.2).style("stroke", "#60afe9").style("fill", "#60afe9");
            count = 0;
            people_flow = d3.layout.force().linkDistance(80).charge(-1000).gravity(.05).size([]);
            channels = [];
            i = 0;
            while (i < 40) {
                channels[i] = [];
                i++;
            }
            people_flow = flow.append("g").selectAll(".people").data(data.first.sort(function (a, b) {
                return a.y - b.y;
            })).enter().append("g").attr("class", "people").on("click", function (d) {
                $('#myModal').modal('show');
                return d3.select("#detailInfo").text(function () {
                    people[d.p].name + "\n";
                });
            }).attr("transform", function (d, i) {
                var c;
                c = 0;
                i = 0;
                while (i < 40) {
                    if (channels[i].length > 0) {
                        if (d.y - d3.max(channels[i]) < 4) {
                            i++;
                            continue;
                        }
                    }
                    channels[i].push(d.y);
                    break;
                    i++;
                }
                if (i % 2 === 0) {
                    return "translate(" + [x(d.y), 200 - i / 2 * 12] + ")rotate(" + 0 + ")";
                } else {
                    return "translate(" + [x(d.y), 200 + (i + 1) / 2 * 12] + ")rotate(" + 0 + ")";
                }
            });
            people_flow.append("text").attr("text-anchor", "end").style("font-size", 10).attr("dy", ".85em").attr("transform", function (d) {
                return "translate(" + [-5, -5] + ")rotate(" + 0 + ")";
            }).text(function (d) {
                return people[d.p].name;
            });
            people_flow.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 5).style("stroke-width", 1).style("stroke", function (d) {
                return "#eee";
            }).style("opacity", .8).style("fill", function (d) {
                return "orangered";
            });
        };
        draw_flow(terms["all pair"]);
    });
};
window.onload = function () {
    $("#chart").on({
        ajaxStart: function () {
            $(this).addClass("loading");
        },
        ajaxStop: function () {
            $(this).removeClass("loading");
        }
    });
    return render_topic("big data", 0, 10000);
};
      