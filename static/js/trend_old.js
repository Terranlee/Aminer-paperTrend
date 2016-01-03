var ball_radius, bar_pos, chart, color, format, formatNumber, height, hist_height, margin, render_topic, root, timeline, timeline_item_offset, width;
root = void 0;
margin = {
    top: 1,
    right: 1,
    bottom: 6,
    left: 1
};

Array.prototype.remove=function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    for(var i=0,n=0;i<this.length;i++) 
    { 
        if(this[i]!=this[dx]) 
        { 
            this[n++]=this[i] 
        } 
    } 
    this.length-=1 
}

Array.prototype.remove_name=function(obj){ 
    for(var i =0;i <this.length;i++){ 
        var temp = this[i]; 
        if(!isNaN(obj)){ 
            temp=i; 
        } 
        if(temp == obj){ 
            for(var j = i;j <this.length;j++){ 
                this[j]=this[j+1]; 
            } 
            this.length = this.length-1; 
        } 
    } 
} 

width = 1500;
height = 900 - margin.top - margin.bottom;      //整个进化图的宽度和高度

formatNumber = d3.format(",.0f");           //格式化，鼠标指到某一个topic的圆点的时候出现的文字里面有XXX Times相关的内容
format = function (d) { 
    return formatNumber(d) + " Times";
};

color = d3.scale.category20();
chart = d3.select("#chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
timeline;

bar_pos = 100;      //左侧的Current Hotspot的属性，包括文字距离左边的距离（bar_pos），每个bar之间纵向的距离(timeline_item_offset)
timeline_item_offset = 20;      //左侧直方图的高度(hist_height)   ball_raduis暂时不知道   //TODO:
ball_radius = 20;
hist_height = 100;

// 这个big data不知道是在哪里体现出来的    //TODO:
d3.select("head").append("script").attr("type", "text/javascript").attr("src", "/static/js/sankey.js");
d3.select(window).on('resize', function () {
    return render_topic("big data", 1, 1000);
});
d3.select('#trend').on('click', function () {
    return render_topic("big data", 1, 1000);
});

// 在该文件最下面的onload函数中被调用
// render_topic("big data", 0, 10000)
render_topic = function (q, start, end) {
    var area, path, sankey, svg, y;
    // 330负责调整演化图的高度，值设定的越高，同一个时间下的若干topic间距越远
    // width还是全局的width=1500，演化图的宽度
    // nodewidth似乎是设置节点大小的，但是圆形节点似乎是在后面node.append("circle")设置的，还不太清楚   //TODO:
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

    // timeline画在right-box中，应该是那个直方图
    timeline = d3.select("#right-box").append("svg").attr("overflow", "scroll");

    svg = chart.append("g").attr("height", 350).attr("id", "trend");
    svg.on("mousewheel", function () {
    });
    svg.append("line").attr("id", "nvMouse").attr("class", "hidden").style("stroke", "red").style("stroke-width", 5);

    // 画一条横线，隔开上面的演化图和下面的关键的几个作者的两张图，从(0,330)画到(width,330)
    chart.append("line").attr("x1", 0).attr("x2", width).attr("y1", 330).attr("y2", 330).attr("id", "cutline").style("stroke", "darkgray").style("stroke-width", 1);
    $("#chart").addClass("loading");


    d3.json("/static/js/trend_out.json", function (energy) {
        // 从文件中读取数据，保存到energy这个量中
        var axis, basis, draw_flow, draw_right_box, flow, force, item, link, max_freq, max_sum, node, people, terms, time_slides_dict, time_slides_offset, time_window, x;
        // changed by Terranlee
        // 用来统计每个节点还是否有边连接过来？
        var node_count = new Array(energy.nodes.length);
        for(var i=0; i<node_count.length; i++){
            node_count[i] = 0;
        }
        for(var i=0; i<energy.links.length; i++){
            s = energy.links[i].source;
            t = energy.links[i].target;
            node_count[s] += 1;
            node_count[t] += 1;
        }
        // 是否为第一次生成演化图？还是之后进行修改之后得到的？
        // 如果是之后修改的，那就不用重新生成linearGradient了
        var is_first = 1;

        $("#chart").removeClass("loading");
        terms = {};
        max_sum = 0;
        energy.terms.forEach(function (t) {
            // terms中的y和d应该就像是每个topic的time distribution，每一年的
            // terms中的doc应该是相关的文档编号，freq = len(doc) = 所有d的求和

            // 但是terms中还有一个dist，应该是分布的意思，但是和d对应不上啊。。。
            // dist应该是按照时间片切分的，有11项，正好对应energy.time_slides中的11个时间片
            // dist的意思暂时不知道
            //TODO:

            // t.sum是最近几年的paper数量，大于2010年的
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

        // 左侧直方图的长度（也就是能容纳多少项）
        // energy.terms表示的应该就是直方图中表示的那些研究方向
        timeline.attr("height", function (d) {
            return 25 * energy.terms.length;
        });
        // 直方图左侧有一条灰色的竖线，宽度0.5
        timeline.append("line").attr("x1", bar_pos + 10).attr("x2", bar_pos + 10).attr("y1", 0).attr("y2", function () {
            return 25 * energy.terms.length;
        }).style("stroke", "gray").style("stroke-width", .5);

        // 找到terms中freq最大的值
        max_freq = 0;
        energy.terms.forEach(function (d) {
            if (d.freq > max_freq) {
                max_freq = d.freq;
            }
        });

        d3.select("#nav").style("display", "");
        d3.select(".active").classed("active", false);
        d3.select($("#first-three").parent()[0]).classed("active", "true");

        // 画出左侧的直方图
        draw_right_box = function () {
            var hist;
            // 对所有的terms进行排序，是按照sum排的，也就是之前算出来的2010年之后的paper的数量
            energy.terms.sort(function (a, b) {
                return b.sum - a.sum;
            });
            // 画直方图
            // 一连串的selectAll.data.enter.append可以看这个网页的介绍： http://www.sxt.cn/u/2839/blog/4316
            // function的参数i和d是怎么对应到具体的term或者从0开始的index上的？是d3.js自动完成的吗？   //TODO:
            hist = timeline.append("g").selectAll(".term").data(energy.terms).enter().append("g").attr("class", "term").attr("transform", function (d, i) {
                return "translate(" + [0, i * timeline_item_offset + 20] + ")rotate(" + 0 + ")";
            }).attr("id", function (d) {
                // 设置每个直方图模块的id
                return "term-" + d.idx;
            }).on("click", function (d) {
                // 如果点击到一个直方图上，就用某一个term去执行draw_flow
                draw_flow(d);
            });

            // 画出矩形结构
            hist.append("rect").attr("x", function (d) {
                return bar_pos + 10;
            }).attr("y", function (d) {
                return 0;
            }).attr("height", 18).attr("width", function (d) {
                // 矩形的长度按照sum值生成
                return hist_height * d.sum / max_sum;
            }).style("fill-opacity", 0.7).style("fill", "#60aFe9").append("svg:title").text(function (d) {
                return d.sum;
            });

            // 最后再画出所有的topic是什么
            hist.append("text").attr("text-anchor", "end").attr("transform", function (d) {
                return "translate(" + [bar_pos, 0] + ")rotate(" + 0 + ")";
            }).style("font-size", 12).attr("dy", ".85em").text(function (d) {
                return d.t;
            });
        };
        draw_right_box();


        d3.select("#first-three").on("click", function (e) {
            // 某种点击之后就会重画一次
            d3.select(".active").classed("active", false);
            d3.select(this.parentNode).classed("active", true);
            d3.selectAll(".term").remove();
            energy.terms.sort(function (a, b) {
                return b.freq - a.freq;
            });
            draw_right_box();
            draw_flow(terms[q]);
        });

        // 如果点击到revert，也就是Overall那个项目的时候
        d3.select("#revert").on("click", function (e) {
            var hist;
            d3.select(".active").classed("active", false);
            d3.select(this.parentNode).classed("active", "true");
            d3.selectAll(".term").remove();
            // 此时是overall而不是hotspot，所以按照所有的paper数量freq来排序
            energy.terms.sort(function (a, b) {
                return b.freq - a.freq;
            });
            // 这些和上面的代码相同
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
                // 这个时候矩形的宽度使用的是freq相关的参数，和之前的不一样
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

        draw_trend_initialize = function(){
            // 接下来的部分和演化图相关
            // time_slides相关处理，这一步相当于是构建了一个二维矩阵，给定一个year之后，就能够查出在矩阵中对应的i和j
            time_slides_dict = {};
            time_slides_offset = {};
            energy.time_slides.forEach(function (time, i) {
                time.sort();
                time.forEach(function (year, j) {
                    time_slides_dict[year] = i;
                    time_slides_offset[year] = j;
                });
            });
            // window是一个时间片的长度
            time_window = energy.time_slides[0].length;

            // 给定一个年份，转换为演化图中的x坐标
            // width=1500是全局的，width / energy.time_slides.length就是一个时间片的坐标长度，在乘上二维矩阵中所确定的坐标即可
            x = function (year) {
                return (time_slides_dict[year] + ((1 / time_window) * time_slides_offset[year])) * width / energy.time_slides.length;
            };

            // 画出竖向的时间线
            axis = svg.append("g").selectAll(".axis").data(energy.time_slides).enter().append("g").attr("class", "axis").attr("transform", function (d, i) {
                // 每一条线位于 i * width / energy.time_slides.length 的位置
                return "translate(" + i * width / energy.time_slides.length + "," + 0 + ")";
            });
            axis.append("line").attr("x1", function (d) {
                // 应该是先translate，之后画线的时候，坐标x1,x2就能够从0开始了吧?
                //TODO:
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
            // 给时间竖线添加文字
            axis.append("text").attr("x", -6).attr("y", 10).attr("dy", ".0em").attr("text-anchor", "end").attr("transform", null).text(function (d, i) {
                return d3.min(d);
            }).attr("x", 6).attr("text-anchor", "start").style("font-weight", "bold");
        }
        draw_trend_initialize();
        
        force = d3.layout.force();
        var link_group, node_group;

        // 应该是在设置nodes，links，items
        // nodeOffset和layout的意义还不是很清楚   //TODO:
        sankey.nodes(energy.nodes).links(energy.links).items(energy.terms).nodeOffset(width / energy.time_slides.length).layout(300);

        draw_trend_links = function(){
            // changed by Terranlee
            link_group = svg.append("g");
            link = link_group.selectAll(".link").data(energy.links).enter().append("path").attr("class", function (d) {
                // 意思是明白了，但是trend_out.json里面的link是source和target啊。。。为什么这里变成了source_index和target_index?
                // 这里把link后面的空格去掉了，否则之后select的时候选不中，可能是select不支持空格...
                // changed by Terranlee
                return "link-" + d.source_index + "-" + d.target_index;
            }).attr("d", path).style("stroke-width", function (d) {
                return 20;
            }).style("fill-opacity", .6).style("fill", function (d) {
                var key;
                key = "gradient-" + d.source_index + "-" + d.target_index;
                if(is_first == 1){
                    // 颜色渐变都是水平渐变
                    svg.append("linearGradient").attr("id", key).attr("gradientUnits", "userSpaceOnUse").attr("x1", d.source.x + 50).attr("y1", 0).attr("x2", d.target.x).attr("y2", 0).selectAll("stop").data([
                        {
                            offset: "0%",
                            // 在 computeNodeLinks里面，已经被每个link的source设定为一个node了
                            // 每个node是有cluster属性的
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
                }
                return d.color = "url(#" + key + ")";
            }).sort(function (a, b) {
                return b.dy - a.dy;
            }).on("mouseover", function () {
                // 各种mouse操作以及title
                d3.select(this).attr("opacity", .6);
            }).on("mouseout", function () {
                d3.select(this).transition().duration(250).attr("opacity", function () {
                    return 1;
                });
            }).on("dblclick", function (d) {
                // 不是首次生成演化图了，linearGradient不需要重新计算
                is_first = 0;
                sankey.remove_link(d);
                sankey.repaint(300);
                /*
                // 是否需要将一个node也去掉？
                // 如果前后没有边进来，也没有边出去，那么这个node就要删掉
                node_count[d.source_index] -= 1;
                node_count[d.target_index] -= 1;
                if(node_count[d.source_index] <= 0){
                    energy.nodes.remove(d.source_index);
                }
                if(node_count[d.target_index] <= 0){
                    energy.nodes.remove(d.target_index);
                }
                */

                // remove the previous paths, nodes, forces, gradients
                link_group.remove()
                node_group.remove()
                // add new paths, nodes, forces. gradients, and start all over again!
                draw_trend_links();
                draw_trend_nodes();
                draw_trend_force();
            });
            link.append("title").text(function (d) {
                return d.source.name + " → " + d.target.name + d.source_index;
            });
        }
        draw_trend_links();

        draw_trend_nodes = function(){
            node_group = svg.append("g");
            node = node_group.selectAll(".node").data(energy.nodes).enter().append("a").attr("href", "#").attr("class", "popup").attr("rel", "popuprel").append("g").attr("class", "node").call(force.drag).on("mouseover", function (d, event) {
                // 每一个小红点，鼠标移动上去之后，变得半透明，而且出现一个提示框
                var xPosition, yPosition;
                d3.select(this).attr("opacity", .6);
                xPosition = d3.event.layerX + 50;
                yPosition = d3.event.layerY + 30;
                // 提示框的位置
                if (xPosition > 900) {
                    xPosition = d3.event.layerX - 200;
                }
                d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(function () {
                    // computeNodeValues函数里面讲d.value赋值为了d.w
                    return d.name + "：  " + format(d.value) + " " + d.y;
                });
                d3.select("#tooltip").classed("hidden", false);
            }).on("mouseout", function () {
                // 鼠标移动出去之后，提示框消失，而且不透明
                d3.select(this).transition().duration(400).attr("opacity", function () {
                    return 1;
                });
                d3.select("#tooltip").classed("hidden", true);
            }).on("dblclick", function (d) {
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
            // 为每一个node花一个小红点
            node.append("circle").attr("cy", function (d) {
                return (d.dy / 2) + 5;
            }).attr("r", 5).attr("stroke", "black").attr("stroke-width", 1).attr("fill", "red");
            node.append("text").attr("x", -20).attr("y", function (d) {
                return d.dy / 2;
            }).attr("text-anchor", "middle").attr("transform", null).text(function (d) {
                // 标记名字
                return d.name;
            }).style("fill", function (d) {
                return "black";
            }).style("font-weight", "bold").style("font", function (d) {
                // 字体的大小还和node的w值有关，在json文件中可以找到
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
        }
        draw_trend_nodes();

        draw_trend_force = function(){
            // energy.nodes是真实出现在演化图中的小红点，
            // 每个nodes其实应该是一堆的key组成的，但是程序只挑选了weight最大的那一个作为name
            // nodes.pos是出现在第几个时间片

            force.nodes(energy.nodes).gravity(.1).charge(function (d) {
                if (d.dy < 10) {
                    return -(d.dy * 10);
                } else {
                    return -(d.dy * 4);
                }
            }).size([width, 330]).start();

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
        }
        draw_trend_force();

        draw_item_trend = function(){
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
        }
        //draw_item_trend();

        // 针对某一个topic，画出演化图下方的flow图
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
        //draw_flow(terms["all pair"]);
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
      