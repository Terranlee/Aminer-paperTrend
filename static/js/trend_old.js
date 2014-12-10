// $(".navbar-inner").append('<div class="form-search pull-right"><input type="text" class="input-medium search-query"' +
//         ' id="topic-trend-search-text"><button class="btn" id="topic-trend-search">Search</button></div>');


var root;  //// jixiangyu  test_zoom


////the cordiantes of the mouse   jixiangyu
function getEventObject(W3CEvent) {   //事件标准化函数
return W3CEvent || window.event;
}


function getPointerPosition(e) {   //兼容浏览器的鼠标x,y获得函数
e = e || getEventObject(e);
var x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
var y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
return { 'x':x,'y':y };
}




var margin = {
        top: 1,
        right: 1,
        bottom: 6,
        left: 1
},
        width = $(window).width() - 240 - margin.left - margin.right,////////////////jixiangyu
        height = 1050 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
        format = function(d) {
                return formatNumber(d) + " Times";
        },
        color = d3.scale.category20();

var chart = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);


var sankey = d3.sankey()             ////////////基本sankey 框架
        .nodeWidth(0)            //////每个node 的水平宽度和纵向间距，此处可以尝试利用算法改写 ！jixiangyu
        .nodePadding(0)
        .size([width, 330]);

var path = sankey.link();

var area = d3.svg.area()           //////////d.y:node左上角的纵坐标；d.dy:node的长；d3.event.y:鼠标的坐标   !!jixiangyu
        .x(function(d) {
                return d.x;
                console.log(d.x);
        })
        .y0(function(d) {
                return d.y0;
        })
        .y1(function(d) {
                return d.y1;
        });

var y = d3.scale.linear()
        .range([height, 0]);

$("#chart").on({
        ajaxStart: function() {
                $(this).addClass("loading");
        },
        ajaxStop: function() {
                $(this).removeClass("loading");
        }
});

chart.append("line").attr("id","dk").attr("x1", 0).attr("x2", width).attr("y1", 350).attr("y2", 350).style("stroke", "red").style("stroke-width", 100);

d3.select("#topic-trend-search").on("click", function(e) {
        render_topic($("#topic-trend-search-text").val(), 0, 10000); // parseInt($("#topic-trend-search-start").val()), parseInt($("#topic-trend-search-end").val()), parseInt($("#topic-trend-search-timewindow").val()));
})

$(document).ready(function() {
        var get_query = function(name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
        var query = get_query('q');
        if (query.length > 0) {
                render_topic(query, 0, 10000);
        }
});

var timeline = d3.select("#right-box").append("svg");
var bar_pos = 170;
var timeline_item_offset = 20;
var ball_radius = 6;
var hist_height = 100;
// function resize_chart(){
//   d3.select("#chart").style("width", (window.width - 2 * 50)+"px");
// }

// resize_chart();
// window.onresize = resize_chart();
render_topic("big data", 0, 10000);
// document.getElementById("topic-trend-search-text").value ="deep learning";
// document.getElementById("topic-trend-search-threshold").value =0.0001;

function render_topic(q, start, end) {
        chart.remove();
        chart = d3.select("#chart").append("svg").attr("id","dark").attr("width", width) //width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
                .attr("transform", "translate(" +70 + "," +25 + ")");





        svg = chart.append("g")
                .attr("height", 350)
                .attr("id", "trend");//.on("mousemove",function(event){////////jixiangyu
                        /* console.log(d3.event.pageX+"       "+d3.event.clientX+"       "+d3.event.offsetX+"      "+d3.event.layerX);*/
                       // d3.select("#nv-guideline")
                                            //    .attr("x1", d3.event.layerX)   ///////////（1）始终与鼠标坐标有偏差:layerX？？？jixiangyu ！！！有可能只支持firefox   伴随鼠标放到link上消失的效果
				 	//	.attr("x2", d3.event.layerX)   ///////////pageX
				 	//	.attr("y1", 600)
				 	//	.attr("y2",20);
                    /* console.log("check line");*/
                         // });
       svg.on("mousewheel",function(){console.log("ok,che");});
       
 svg.append("line").attr("id", "nvMouse").attr("class","hidden")   //////////制造鼠标引导线  jixiangyu
				 		.style("stroke", "red")
                                                .style("stroke-width", 5);
 
        /*svg.on("mousemove",function(event){           //////////////引导线坐标，效果与（1）处有很大区别？？？可能是浏览器固定坐标的偏差
                        // var event = window.event || event;
                     d3.select("#nvMouse")  .attr("x1", function(event){
                             if(d3.event.layerX){
                                //console.log("yes");
                                console.log(document.body.clientLeft);
                            return d3.event.layerX-document.body.clientLeft;
                        }
                        
                        else return (d3.event.clientX - document.body.clientLeft);
                            
                        



                        })   ///////////始终与鼠标坐标有偏差:layerX？？？jixiangyu ！！！
                        .attr("x2", function(event){

                                 if(d3.event.layerX){
                            return d3.event.layerX-document.body.clientLeft;
                        }
                        
                        else return (d3.event.clientX- document.body.clientLeft);

                        })   ///////////pageX
                        //.attr("x1", d3.event.layerX)   ///////////始终与鼠标坐标有偏差:layerX？？？jixiangyu ！！！
				 		//.attr("x2", d3.event.layerX)   ///////////pageX
				 	.attr("y1", 330)
					.attr("y2",20)
                     .attr("position","absolute")
                     .classed("hidden", false);

                           });*/


        chart.append("line").attr("x1", 0).attr("x2", width).attr("y1", 330).attr("y2", 330).attr("id","cutline")  ///////jixiangyu
                .style("stroke", "darkgray").style("stroke-width", 1);

        timeline.remove();
        timeline = d3.select("#right-box").append("svg");               ///////////左边栏增加svg

        $("#chart").addClass("loading");

        
        d3.json("/static/js/trend_out.json", function(energy) {             ////////回调函数，数据绑定
                $("#chart").removeClass("loading");
                //data transformation
                var terms = {};
                max_sum = 0;
                energy.terms.forEach(function(t) {
                        t.sum = 0;
                        //wangxiao
                        t.year.forEach(function(tt){
                                if ((tt.y>2010)&&(tt.d>0)) {
                                        t.sum+=tt.d;
                                }
                        });
                        if (t.sum > max_sum) {
                                max_sum = t.sum;
                        };
                        terms[t.t] = t;
                })

                var people = {};              ////////////////////////存的是数组，以id 作为下标标识 姓名  jixiangyu
                energy.people.forEach(function(t) {
                        people[t.id] = t;
                })

                timeline.attr("height", function(d) {                 //////////左边栏的svg      jixiangyu

                        return 25 * energy.terms.length;              /////////////terms 是左边栏关键字的组数      jixiangyu
                 })

                //right box, hist diagram
                timeline.append("line")                              //////////////hotpot和overow 分隔线         jixiangyu
                        .attr("x1", bar_pos + 10)
                        .attr("x2", bar_pos + 10)
                        .attr("y1", 0)
                        .attr("y2", function(){
                                return 25 * energy.terms.length;
                        })
                        .style("stroke", "gray")
                        .style("stroke-width", .5);

                max_freq = 0;
                energy.terms.forEach(function(d) {                    //////////freq最大值         jixiangyu
                        if (d.freq > max_freq) {
                                max_freq = d.freq;
                        }
                });
//flagD
                d3.select("#nav").style("display","");                       ///////////显示 hotpot 和overrow标签           jixiangyu
                d3.select(".active").classed("active",false);
                d3.select($("#first-three").parent()[0]).classed("active","true");
                
                function draw_right_box(){                                      //////////////左边栏对应蓝色矩形框的长度         jixiangyu
                        energy.terms.sort(function(a,b){return b.sum-a.sum})
                        var hist =
                        timeline.append("g")
                        .selectAll(".term")
                        .data(energy.terms)
                        .enter()
                        .append("g")
                        .attr("class", "term")
                        .attr("transform", function(d, i) {
                                return "translate(" + [0, i * timeline_item_offset + 20] + ")rotate(" + 0 + ")";
                        })
                        .attr("id", function(d){
                                return "term-"+d.idx;
                        })
                        .on("click", function(d) {
                                draw_flow(d);
                        })

                        hist.append("rect")
                                .attr("x", function(d) {
                                        return bar_pos + 10;
                                })
                                .attr("y", function(d) {
                                        return 0;
                                })
                                .attr("height", 18)
                                .attr("width", function(d) {
                                        return hist_height * d.sum / max_sum;
                                })
                                .style("fill-opacity", 0.7)
                                .style("fill", "#60aFe9")
                                .append("svg:title")
                                .text(function(d) { return d.sum; });
        
                        hist.append("text")
                                .attr("text-anchor", "end")
                                .attr("transform", function(d) {
                                        return "translate(" + [bar_pos, 0] + ")rotate(" + 0 + ")";
                                })
                                .style("font-size", 12)
                                .attr("dy", ".85em")
                                .text(function(d) {
                                        return d.t;
                                })
                }
                draw_right_box();
                d3.select("#first-three").on("click", function(e){
                        d3.select(".active").classed("active",false);
                        d3.select(this.parentNode).classed("active",true);              ////////////////<li>
                        d3.selectAll(".term").remove();
                        energy.terms.sort(function(a,b){return b.freq-a.freq});
                        draw_right_box();
                        draw_flow(terms[q]);
                })
//flag
                d3.select("#revert").on("click", function(e) {/////////////////////////////////点击按键，转换不同关键词矩形，方法重写   jixiangyu
                        d3.select(".active").classed("active",false);
                        d3.select(this.parentNode).classed("active","true");
                        d3.selectAll(".term").remove();
                        energy.terms.sort(function(a,b){return b.freq-a.freq})

                        var hist =
                                timeline.append("g")
                                .selectAll(".term")
                                .data(energy.terms)
                                .enter()
                                .append("g")
                                .attr("class", "term")
                                .attr("id", function(d){
                                        return "term-"+d.idx;               ///////////////////idtest         
                                })
                                .attr("transform", function(d, i) {
                                        return "translate(" + [0, i * timeline_item_offset + 20] + ")rotate(" + 0 + ")";
                        })
                        .on("click", function(d) {
                                draw_flow(d);
                        })
                        
                        hist.append("rect")
                                .attr("x", function(d) {
                                        return bar_pos + 10;
                                })
                                .attr("y", function(d) {
                                        return 0;
                                })
                                .attr("height", 18)
                                .attr("width", function(d) {
                                        return hist_height * d.freq / max_freq;
                                })
                                .style("fill-opacity", 0.7)
                                .style("fill", "#60aFe9")
                                .append("svg:title")
                                .text(function(d) { return d.sum; });

                        hist.append("text")
                                .attr("text-anchor", "end")
                                .attr("transform", function(d) {
                                        return "translate(" + [bar_pos, 0] + ")rotate(" + 0 + ")";
                                })
                                .style("font-size", 12)
                                .attr("dy", ".85em")
                                .text(function(d) {
                                        return d.t;
                                })
                        draw_flow(terms[q]);                                //////////////
                })
////////////////////////左边，关键词框形图绘制结束   jixiangyu
                var time_slides_dict = {};
                var time_slides_offset = {};
                energy.time_slides.forEach(function(time, i) {
                        time.sort();
                        time.forEach(function(year, j) {
                                time_slides_dict[year] = i;
                                time_slides_offset[year] = j;
                        })
                })

                var time_window = energy.time_slides[0].length;

                var x = function(year) {
                        return (time_slides_dict[year] + ((1 / time_window) * time_slides_offset[year])) * width / energy.time_slides.length;
                }

                var axis = svg.append("g").selectAll(".axis")            /////////////横坐标的时间轴   svg:chart 里的g     jixiangyu
                        .data(energy.time_slides)
                        .enter().append("g")
                        .attr("class", "axis")
                        .attr("transform", function(d, i) {
                                return "translate(" + (i) * width / energy.time_slides.length + "," + 0 + ")";
                        })

                axis.append("line")
                        .attr("x1", function(d) {
                                return 0;
                        })
                        .attr("x2", function(d) {
                                return 0;
                        })
                        .attr("y1", function(d) {
                                return 0;
                        })
                        .attr("y2", function(d) {
                                return 1000;
                        })
                        .style("stroke", function(d) {
                                return "lightgray";
                        })
                        .style("stroke-width", function(d) {
                                return 1;
                        })
///nowji
                axis.append("text")
                        .attr("x", -6)
                        .attr("y", 10)
                        .attr("dy", ".0em")
                        .attr("text-anchor", "end")
                        .attr("transform", null)
                        .text(function(d, i) {
                                return d3.min(d);
                        })
                        .attr("x", 6)
                        .attr("text-anchor", "start")
                        .style("font-weight", "bold");

                sankey
                        .nodes(energy.nodes)
                        .links(energy.links)
                        .items(energy.terms)
                        .nodeOffset(width / energy.time_slides.length)
                        .layout(300);            //整体生成过程中有浏览器的自适应！数值大的node向下移动  jixiangyu1!!
                                                //minimum crossing algo

                root=energy.links;    /////jixiangyu test_zoom


                /*var createTag=function(topic){
                    d3.layout.cloud().size([300, 300])
                            .words(topic.map(function(d) {
                            return {text: d, size: 10 + d.w*10};
                        }))
                        .padding(5)
                        .rotate(function() { return ~~(Math.random() * 2) * 90; })
                        .font("Impact")
                        .fontSize(function(d) { return d.size; })
                        .on("end", draw)
                        .start();

                    function draw(words) {
                        d3.select("#trendByYear").append("svg")
                            .attr("width", 300)
                            .attr("height", 300)
                            .append("g")
                            .attr("transform", "translate(150,150)")
                            .selectAll("text")
                            .data(words)
                            .enter().append("text")
                            .style("font-size", function(d) { return d.size + "px"; })
                            .style("font-family", "Impact")
                            .style("fill", function(d, i) { return fill(i); })
                            .attr("text-anchor", "middle")
                            .attr("transform", function(t) {
                                 return "translate(" + [t.x, t.y] + ")rotate(" + t.rotate + ")";
                            })
                            .text(function(d) { return t.text; });
                    }
                }*/


                var link = svg.append("g").selectAll(".link")
                        .data(energy.links)
                        .enter().append("path")
                        .attr("class", "link")
                        .attr("d", path)
                        .style("stroke-width", function(d) {
                                return 20
                        })
                        .style("fill-opacity", .6)
                        .style("fill", function(d) {
                                var key = "gradient-" + d.source_index + "-" + d.target_index;
                                svg.append("linearGradient")
                                        .attr("id", key)
                                        .attr("gradientUnits", "userSpaceOnUse")
                                        .attr("x1", d.source.x + 50).attr("y1", 0)
                                        .attr("x2", d.target.x).attr("y2", 0)
                                        .selectAll("stop")
                                        .data([{
                                                offset: "0%",
                                                color: color(d.source.cluster)
                                        }, {
                                                offset: "100%",
                                                color: color(d.target.cluster)
                                        }])
                                        .enter().append("stop")
                                        .attr("offset", function(d) {
                                                return d.offset;
                                        })
                                        .attr("stop-color", function(d) {
                                                return d.color;
                                        });
                                return d.color = "url(#" + key + ")";
                        })
                        .sort(function(a, b) {
                                return b.dy - a.dy;
                        }).on("mouseover",function(){d3.select(this).attr("opacity", .6);})////////鼠标悬浮在节点上的变化效果   jixiangyu
            			.on("mouseout",function(){  d3.select(this)
                                .transition()
                                .duration(250)
                                .attr("opacity", function() { return 1; })})
                        .on("click",function(d){

                            var tagContent=[];
                            tagContent.push(d.source);
                            tagContent.push(d.target);

                            $("#trendByYear").empty();
                            //console.log("link clicked");
                            var topic=[];
                            topic.push(d.source.name);
                            topic.push(d.target.name);
                           // console.log(topic);
                        //time trend jixiangyu/
                        //<span id="interploatTrend" class="label label-info capitalize light"></span>
d3.select("#trendByYear").selectAll("span").data(topic).enter().append("span")
.attr("class","label label-info capitalize light").text(function(d,i){
    if(i==0)
    return d+" --> ";
    else
        return d;
});
/*
var topicFlow=d3.select("#trendByYear").append("svg")
        .attr("width", 500)
        .attr("height", 200)
        .append("g");

        topicFlow.append('line')
            .attr('x1', 0)
            .attr('y1', 200)
            .attr('x2', 350)
            .attr('y2', 200)
            .style('stroke-width', 3)

        topicFlow.append("text")
                        .attr("x", -6)
                        .attr("y", 10)
                        .attr("dy", ".0em")
                        .attr("text-anchor", "end")
                        .attr("transform", null)
                        .text(function() {
                                return 1973+4*d.source.pos;
                        })
                        .attr("x", 6)
                        .attr("text-anchor", "start")
                        .style("font-weight", "bold");   
  */      
//createTag(tagContent);
                            d3.select("#trendByYear")
                        .style("margin-left", "10px")
                        .style("margin-top", "330px")
                        ;                     

                        $('.dark').append('<div id="fade"></div>');
                        $('#fade').css({'filter' : 'alpha(opacity=100)'}).fadeIn(1000,function(){

                            d3.select("#trendByYear").classed("hidden", false);
                        });  ////////////IE透明度?

                        //end time trend

                     ////   ======cloud begin   jixiangyu
                     /*
                          d3.layout.cloud().size([300, 300])
                            .words([
                        d.target.name,d.source.name])
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(t) { return t.size; })
      .on("end", draw)
      .start();

  function draw(words) {
    d3.select("#trendByYear").append("svg")
        .attr("width", 300)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(t, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(t) {
          return "translate(" + [t.x, t.y] + ")rotate(" + t.rotate + ")";
        })
        .text(function(d) { return t.text; });
  }*/


                     ///    =======cloud  end   
               
                    //Show the tooltip
                    
                                
                    });
/////jixiangyu   test_zoom
                        //d3.select(window).on("click", function() { zoom(root); });




                link.append("title")
                        .text(function(d) {
                                return d.source.name + " → " + d.target.name+d.source_index;
                        });

                ///jixiangyu
                ///force test
    
                var force = d3.layout.force();
                    //.charge(-300)
                    //.linkDistance(50)
                    //.size([width, 330]);


                force.nodes(energy.nodes).gravity(.1).charge(function(d){
                    //console.log(d.dy);
                    //if(d.value==0)
                    //    return -(30);
                    if(d.dy<10)
                        return -(d.dy*20);
                    else
                        return -(d.dy*8);

                })    /////jixiangyu   set diff force to diff node
                    //.linkDistance(50)
                    .size([width, 330]).start();
                
                var node = svg.append("g").selectAll(".node")
                        .data(energy.nodes)
                        .enter().append("a").attr("href","#").attr("class",
                          "popup").attr("rel","popuprel").append("g")  /////////////node 为作者信息增加弹出层 jixiangyu
                        .attr("class", "node")
                        //.attr("transform", function(d) {
                        //        return "translate(" + d.x + "," + d.y + ")";
                        //})
                        .call(force.drag)
                        //.call(d3.behavior.drag()
                        //      .origin(function(d) {
                        //                return d;
                        //        })
                        //        .on("dragstart", function() {
                        //                this.parentNode.appendChild(this);
                        //        })
                       //         .on("drag", dragmove))
                                .on("mouseover", function(d,event) {                 /////////鼠标放置在节点之后的简单节点信息       jixiangyu

					d3.select(this).attr("opacity", .6);
                            //Get this bar's x/y values, then augment for the tooltip
                            /*console.log("aaaa");*/
					var xPosition = d3.event.layerX+50;
					var yPosition = d3.event.layerY+30;
                                        if(xPosition>900)
                                         xPosition = d3.event.layerX-200;
					//Update the tooltip position and value
					d3.select("#tooltip")
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")						
						.select("#value")  /*jixiangyu如果.append("strong")此时修改，每次移动到div 均添加文字*/

						.text(function() { return d.name + "：  " + format(d.value)+" "+d.y; });
			   
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
                                 
			   }) .on("mouseout", function() {

                                   d3.select(this)
                                .transition()
                                .duration(400)
                                .attr("opacity", function() { return 1; });
			          //Hide the tooltip
					d3.select("#tooltip").classed("hidden", true);
					
			   }).on("click",function(d){
                console.log("node click");   ////////////////jixiangyu!!!!!!!!!
   								
// a variable popupid which gets the
// rel attribute from the clicked link	

d3.select("#get").text(function() { return d.name + "：  " + format(d.value)+"\n"; });
						
var popupid = $('.popup').attr('rel');
console.log(popupid);

// 弹出层，后期利用d3加入作者主页链接等信息      jixiangyu
$('#' + popupid).fadeIn(1000);////jixiangyu  the black back-ground to be clicked

$('.dark').append('<div id="fade"></div>');
$('#fade').css({'filter' : 'alpha(opacity=100)'}).fadeIn(1000);  ////////////IE透明度?


});

                
                        node.append("a").attr("class","border-fade").append("rect") 
                        .attr("height", function(d) {         ////dx&dy  node 的宽和长      jixiangyu
                                return d.dy;
                        })
                        .attr("width", sankey.nodeWidth())
                        .style("fill", function(d) {
                                return d.color = color(d.cluster);
                        })
                        .style("stroke", function(d) {
                                return d.color;
                        }) //d3.rgb(d.color).darker(2); })
                        .style("stroke-width", function(d) {
                                return 0;
                        })
                        .style("opacity", function(d) {
                                return 0.6;
                        });

                        ///jixiangyu  test to add and implement the node
                        node.append('circle')
                        .attr("cy", function(d) {
                                return (d.dy / 2)+5;
                        })
                        .attr("r",5)
                        .attr("stroke","black")
                        .attr("stroke-width",1)
                        .attr("fill","red");



                       /* .append("title")
                        .text(function(d) {
                                return d.name + "\n" + format(d.value);
                        });*/


 
               node.append("text")             ///////节点的文字显示  jixiangyu
                        .attr("x", -20)
                        .attr("y", function(d) {
                                return d.dy / 2;
                        })
                        .attr("text-anchor", "middle")
                        .attr("transform", null)
                        .text(function(d) {
                                return d.name;
                        })
                        .style("fill", function(d) {
                                return "black" //color(d.cluster);
                        })
                        .style("font-weight", "bold")
                        .style("font", function(d) {
                                var w = d.w;
                                if (w > 15) {
                                        w = 15;
                                }
                                if (w < 10 && w > 0) {
                                        w = 10;
                                }
                                return (w) + "px sans-serif";
                        });


                energy.terms.sort(function(a, b) {
                        return b.start.year - a.start.year;
                })


                  force.on("tick", function() {
                    node.attr("transform", function(d) {
                                d.x=d.pos * (width / energy.time_slides.length);
                                return "translate(" + d.x + "," + d.y + ")";
                        });

                ///d.pos * (width / energy.time_slides.length)
               ///////max 中的0 保证不超过浏览器上端，min中 height -d.dy 保证不超过浏览器下端，height 是 svg 的高度   jixiangyu
                        /*
                        var nodesByBreadth1 = d3.nest()//////jixiangyu   nest? initialize the group sort
                            .key(function(d) { return d.x; })/////group by x-cordinate
                            .sortKeys(d3.ascending)
                            .entries(nodes)
                            .map(function(d) { return d.values; });
                         ///////   begin
                         var nodePadding=8;
                            nodesByBreadth1.forEach(function(d) {
                                        var node,
                                        dy,
                                        y0 = 0,
                                        n = d.length,
                                        i;

        // Push any overlapping nodes down.
                                d.sort(function(a,b){return a.y-b.y;});
                                for (i = 0; i < n; ++i) {
                                    node = d[i];
                                    dy = y0 - node.y;
                                    if (dy > 0) node.y += dy;
                                    y0 = node.y + node.dy + nodePadding;
                                }

        // If the bottommost node goes outside the bounds, push it back up.
                                dy = y0 - nodePadding - size[1];
                                if (dy > 0) {
                                y0 = node.y -= dy;

                                // Push any overlapping nodes back up.
                                for (i = n - 2; i >= 0; --i) {
                                    node = d[i];
                                    dy = node.y + node.dy + nodePadding - y0;
                                    if (dy > 0) node.y -= dy;
                                    y0 = node.y;
                                }
                                }
                            });*/
                        ////////   end
                        sankey.relayout();
                        link.attr("d", path);
                });


////////////////////////////////////////////////////////////////////////sankey 图绘制完毕   jixiangyu
/////////////  以下开始右下方作者趋势变化图的绘制
    /*            var item = svg.append("g").selectAll(".item")
                        .data(energy.terms)
                        .enter().append("g")
                        .attr("class", "item")
                        .attr("transform", function(d) {
                                return "translate(" + x(d.start.year) + "," + (d.start.node.y + d.start.node.dy / 2) + ")";
                        });

                item.append("circle")                 ////////////////////被隐藏的圆，有可能是鼠标竖轴交点??  jixiangyu
                        .attr("cx", function(d) {
                                return 0;
                        })
                        .attr("cy", function(d) {
                                return 0;
                        })
                        .attr("r", function(d) {
                                return d.freq / 10;
                        })
                        .style("stroke-width", 1)
                        .style("stroke", function(d) {
                                return color(d.start.cluster);
                        })
                        .style("stroke-opacity", .5)
                        .style("fill", function(d) {
                                return color(d.start.cluster);
                        })
                        .style("display", "none");

                var basis = d3.svg.area()
                        .x(function(d, i) {
                                return x(d.y)
                        })
                        .y0(function(d) {
                                if (d.d < 30)
                                        return 200 - (d.d) * 5;
                                return 50
                        })
                        .y1(function(d) {
                                if (d.d < 30)
                                        return 200 + d.d * 5;
                                return 350
                        })
                        .interpolate("basis");
///////////////////////////////////jixiangyu
                var flow = chart
                        .append("g")
                        .attr("transform", function(d) {
                                return "translate(" + [0, 350] + ")rotate(" + 0 + ")";
                        })

                var draw_flow = function(data) {  ////people chart in the bottom
                        flow.remove();
                        flow = chart.append("g")
                                .attr("transform", function(d) {
                                        return "translate(" + [0, 350] + ")rotate(" + 0 + ")";
                                });

                        d3.select(".strong").remove()
                        d3.select("#term-"+data.idx)
                                .append("rect")
                                .attr("class","strong")
                                .attr("x","0px")
                                .attr("y", function(d){
                                        return -1.8125;
                                })
                                .attr("width", "300px")
                                .attr("height",  function(d){
                                        return 19.8125;
                                })
                                .style("fill","#9900FF")
                                .style("fill-opacity", 0.2);


                        flow.append("path")
                                .attr("d", function(d) {
                                        return basis(data.year);
                                })
                                .style("stroke-width", 0.2)
                                .style("stroke", "#60afe9")
                                .style("fill", "#60afe9")

                        var count = 0;
                        var people_flow = d3.layout.force()
                                .linkDistance(80)
                                .charge(-1000)
                                .gravity(.05)
                                .size([])

                        var channels=[]
                        for(var i=0; i<40; i++){
                                channels[i] = [];
                        }
                        var people_flow = flow.append("g").selectAll(".people")
                                .data(data.first.sort(function(a,b){
                                        return a.y - b.y
                                }))
                                .enter()
                                .append("g")
                                .attr("class", "people")
                                .attr("transform", function(d, i) {
                                        var c = 0
                                        for(var i = 0; i < 40; i++){
                                                if(channels[i].length > 0){
                                                        if(d.y - d3.max(channels[i]) < 4){
                                                                continue;
                                                        }
                                                }
                                                channels[i].push(d.y);
                                                break;
                                        }
                                        if(i%2 == 0){
                                                return "translate(" + [x(d.y), 200 -i/2 * 12] + ")rotate(" + 0 + ")";
                                        }else{
                                                return "translate(" + [x(d.y), 200 +(i+1)/2 * 12] + ")rotate(" + 0 + ")";
                                        }
                                        
                                });
                        people_flow.append("text")
                                .attr("text-anchor", "end")
                                .style("font-size", 10)
                                .attr("dy", ".85em")
                                .attr("transform", function(d) {
                                        return "translate(" + [-5, -5] + ")rotate(" + 0 + ")";
                                })
                                .text(function(d) {
                                        return people[d.p].name;
                                });
                        people_flow.append("circle")
                                .attr("cx", 0)
                                .attr("cy", 0)
                                .attr("r", 5)
                                .style("stroke-width", 1)
                                .style("stroke", function(d) {
                                        return "#eee";
                                })
                                .style("opacity", .8)
                                .style("fill", function(d) {
                                        return "orangered";
                                })
                }

                draw_flow(terms["all pair"]);


                function dragmove(d) {
                        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");           ///////max 中的0 保证不超过浏览器上端，min中 height -d.dy 保证不超过浏览器下端，height 是 svg 的高度   jixiangyu
                        sankey.relayout();
                        link.attr("d", path);
                }

                //console.log(link);///jixiangyu  

                var leftPos = $('#chart').scrollLeft();
                $("#chart").animate({
                        scrollLeft: leftPos + 200
                }, 800);*/
        });
}

///////jixiangyu   test zoom
/*function zoom(d, i) {
var k = r / d.r / 2;
x.domain([d.x - d.r, d.x + d.r]);
y.domain([d.y - d.r, d.y + d.r]);
var t = vis.transition()
.duration(d3.event.altKey ? 7500 : 750);
t.selectAll("circle")
.attr("cx", function(d) { return x(d.x); })
.attr("cy", function(d) { return y(d.y); })
.attr("r", function(d) { return k * d.r; });
t.selectAll("text")
.attr("x", function(d) { return x(d.x); })
.attr("y", function(d) { return y(d.y); })
.style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });
node = d;
d3.event.stopPropagation();
}*/