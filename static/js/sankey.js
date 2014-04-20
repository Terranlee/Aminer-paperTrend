d3.sankey = function() {
  var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      nodeOffset = 200,
      size = [1, 1],
      nodes = [],
      links = [],
      items = [];

  sankey.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodeOffset = function (_) {
    if (!arguments.length) return nodeOffset;
    nodeOffset = +_;
    return sankey;
  }

  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };

  sankey.items = function(_) {
    if (!arguments.length) return items;
    items = _;
    return sankey;
  };

  sankey.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };

  sankey.layout = function(iterations) {////jixiangyu   the algorithm
    computeNodeLinks();///////transform the link value to node objet
    computeNodeValues();//////set the weight of each node 
    computeNodeBreadths();//////the X cordinate of every nodes
    computeNodeDepths_minimum_jixy(iterations);/////algo:  the order:pos   cordinates : y
    computeLinkDepths();////vertical y cordinates of the link/nodes
    computeItemNode();
    return sankey;
  };


    /////node.pos represent the layer of every node

     /////jixiangyu  begin of the algo test 
     /*
      var layer_content=new Array();

      var p=0,q=0;
      var vertex_num=nodes.length,
      arc_num=links.length;        
      var vertex_node=[];///////jixiangyu  initial ordering!
      var arc=new Array();
      var visited_node=[];

      for(var t=0;t<nodes.length;t++){
        visited_node=0;

      }


      nodes.sort(function(a,b){
        return a.layer-b.layer;
      });
      
      console.log(nodes);
      

      var max_layer=0;

      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
         ///////////jixiangyu   index  setup ?????????
        if(o.layer>max_layer){
          max_layer=o.layer;
        }
       // layer_content[o.layer].push(o);
        o.median_value=0;  //set the initail value for every node   jixiagnyu
        o.weight = 0;//////////set a index for every node;  every node has a weight of 0;  jixiangyu
                          ////////weight shows the link that related to the link
                          ///////initilize the weight=0,index =i for all nodes jixiangyu
      }

          var layer_content=new Array();

      for(i=1;i<=max_layer;i++){
        layer_content[i]=new Array();

      }

  ///////set the content of each layer   jixiangyu
       for (i = 0; i < n; i++){
        o=nodes[i];
        var cont=parseInt(o.layer);
       //  console.log(cont);
        if(o.weight!=0){


        layer_content[cont].push(nodes[i]);

        }
      }

            reorder();


      function reorder(){
        for(i=1;i<=max_layer;i++){
          for(j=0;j<layer_content[i].length;j++){
           // console.log(content[i][j]);
            (o=layer_content[i][j]).layer_order=j+1;
            
          }
        }
        //return nodes;
      }


       function Create_Graph()
    {
      
      
      for(p=0;p<vertex_num;p++){
        var arc_colum=new Array();
        for(q=0;q<vertex_num;q++){
          
          arc_colum.push(0);
        }
        arc.push(arc_colum);
        console.log(arc_colum);
       // console.log(arc);
        }
      
      for(p=0;p<links.length;p++){
        var o=links[p];
        arc[o.source.index][o.target.index]= 1;
        // if (typeof o.target !== "number") o.target = ;
      }
      //console.log(arc);
    }

    function DFS(v)
    {
      var j;
      if (!visited_node[v]) {
        visited_node[v]=1;

      }

      for(j=0;j<nodes.length;j++){
        if (arc[v][j]&&!visited_node[j]) {
          DFS(j);

        }

      }

    }


          var omi=0.5;
      
      function median(iter){
        if(iter%2==0){
          for(var i=1;i<=max_layer;i++){
            for(var a in layer_content[i]){
              (o=layer_content[i][a]).median_value=omi*(a+1)+(1-omi)*median_sun(layer_content[i][a]);

            }
            layer_content[i].sort(function(t,b){
              return t.median_value-b.median_value;
            });
          }
        }
        return reorder();
      }

      function median_sun(node){
        var sum=0;
          for (i = 0; i < m; ++i) {
          o = links[i]
          if (node==o.target) {
          sum=sum+o.weight*o.source.layer_order;

          }
          else if(node==o.source){
            sum=sum+o.weight*o.target.layer_order;

          }
        }

      return sum;
      }

      function transpose(){
        var improved=true;
        while(improved){
          improved=false;
          for(i=1;i<=max_layer;i++){
            for(j=0;j<layer_content[i].length-2;j++){
              var v=layer_content[i][j],w=layer_content[i][j+1];

              if(crossing(v,w,i)>crossing(w,v,i)){
                console.log("change    now");
                improved=true;
                var temp=layer_content[i][j];
                    layer_content[i][j]=layer_content[i][j+1];
                    layer_content[i][j+1]=temp;
                    reorder();
              }


            }
          }
        }
      }

      function crossing(node1,node2,i){

        var cross;

        var neigh1=neighbors[node1.index];
        var neigh2=neighbors[node2.index];
        
       for(var k in neigh1){
        for(var e in neigh2){

          if(k.layer==e.layer&&k.layer_order>e.layer_order){

            cross++;

            

            }
          }
        }

        return cross;

       }

        /*var matrix_corss=new Array(2);
        var colum=new Array();
        for(var temp=0;temp<layer_content[node1.layer+1].length;temp++){
            colum.push(arc[node1.index][layer_content[node1.layer+1][temp]==1));
            

        }*/


/*
      function algo_reorder(){
        reorder();
        for(var timer=0;timer<24;timer++){
          median(timer);
          transpose();


        }
    }

       algo_reorder();

     */

/////=======end of the algo


  sankey.area = d3.svg.area()
          .x(function(d){
            return d.x;
          })
          .y0(function(d){
            return d.y0;
          })
          .y1(function(d){
            return d.y1;
          });


  sankey.relayout = function() {
    computeLinkDepths();
    //computeNodeDepths_minimum_jixy(300);
    //computeLinkDepths();

    return sankey;
  };

  sankey.link = function() {
    var curvature = .5;
    function link(d) {
      var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          xj = d3.interpolateNumber(x1, x0),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          x4 = xj(curvature),
          x5 = xj(1 - curvature),
          m = (x0 + x1) / 2;
          y0_top = d.source.y + d.sy;
          y0_bottom = d.source.y + d.sy + d.dy1,
          y1_top = d.target.y + d.ty;// + d.ty;
          y1_bottom = d.target.y + d.ty + d.dy2;
      return "M" + x0 + "," + y0_top
           + "C" + x2 + "," + y0_top
           + " " + x3 + "," + y1_top
           + " " + x1 + "," + y1_top
           + "L" + x1 + "," + y1_bottom
           + "C" + x4 + "," + y1_bottom
           + " " + x5 + "," + y0_bottom
           + " " + x0 + "," + y0_bottom
           + "L" + x0 + "," + y0_top;
    }

    link.curvature = function(_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      link.source_index = source;
      link.target_index = target;
      if (typeof source === "number") source = link.source = nodes[link.source];
      if (typeof target === "number") target = link.target = nodes[link.target];
      source.sourceLinks.push(link);/////the link in which node as souce/link
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  ////jixiangyu  chabnge to the weight of the node 
  function computeNodeValues() {
    nodes.forEach(function(node) {
      //console.log("check");
      node.value = node.w;
      // node.value = Math.max(
      //   d3.sum(node.sourceLinks, value),
      //   d3.sum(node.targetLinks, value)
      // );
    });
  }
  ///jixiangyu    the compute layouut order
///the node neighbor to the neighboring nodes???
  function computeItemNode() {
    items.forEach(function(item) {
      item.node.forEach(function(node){
        node_id = node;
        node = {};
        node.cluster = nodes[node];
      })
      item.start.node_id = item.start.node;
      item.start.node = nodes[item.start.node_id];
    })

  }

  // Iteratively assign the breadth (x-position) for each node.///////////jixiangyu
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
    // var remainingNodes = nodes,
    //     nextNodes,
    //     x = 0;


   // var test=1;
    nodes.forEach(function(node){
      node.x = node.pos * nodeOffset;////pos is in the Json data  jixiangyu 

      //console.log(node.cluster);
      //test++;
      
      node.dx = nodeWidth;
    });

    // while (remainingNodes.length) {
    //   nextNodes = [];
    //   remainingNodes.forEach(function(node) {
    //     node.x = x;
    //     node.dx = nodeWidth;
    //     node.sourceLinks.forEach(function(link) {
    //       nextNodes.push(link.target);
    //     });
    //   });
    //   remainingNodes = nextNodes;
    //   ++x;
    // }

    //
    // moveSinksRight(x);
    // scaleNodeBreadths((width - nodeWidth) / (x - 1));
  }

  function moveSourcesRight() {
    nodes.forEach(function(node) {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
      }
    });
  }

  function moveSinksRight(x) {
    nodes.forEach(function(node) {
      if (!node.sourceLinks.length) {
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function(node) {
      node.x *= kx;
    });
  }

  function computeNodeDepths_minimum_jixy(iterations) {
    var nodesByBreadth = d3.nest()//////jixiangyu   nest? initialize the group sort
        .key(function(d) { return d.x; })/////group by x-cordinate
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });   

    initializeNodeDepth();
    resolveCollisions();
    for (var alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= .99);/////
      resolveCollisions();
      relaxLeftToRight(alpha);/////symmetric if the layout  jixiangyu 
      resolveCollisions();
    }


     //
    function initializeNodeDepth() {
      var ky = d3.min(nodesByBreadth, function(nodes) {
        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
      });

      nodesByBreadth.forEach(function(nodes) {
       
                  var ojoj=[1,2,3,1];
          //console.log(d3.sum(ojoj,sum_jixy));
          //console.log("this sum_test")
          function sum_jixy() {
        // return center(link.source) * link.value;
        return 2;
      }
          

        nodes.forEach(function(node, i) {
          node.y = i;
          //node.dy=80;

          ///console.log(node.y);
          node.dy = node.value * ky;   ///height of every node

          //median_value();  jixiangyu

          //
        });
      });

      links.forEach(function(link) {
        // link.dy = link.value * ky;
        link.dy1 = link.source.w * link.w1 * ky / d3.sum(link.source.sourceLinks, weight1);
        link.dy2 = link.target.w * link.w2 * ky / d3.sum(link.target.targetLinks, weight2);
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes, breadth) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, weight1);
            node.y += (y - center(node)) * alpha;/////jixiangyu   the y-cordinate of the node
          }
        });
      });

      function weightedSource(link) {
        // return center(link.source) * link.value;
        return center(link.source) * link.w1;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            ////jixiangyu   the implementation of the algo
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, weight2);
            node.y += (y - center(node)) * alpha;

          }
        });
      });

      function weightedTarget(link) {
        // return center(link.target) * link.value;
        return center(link.target) * link.w2;
      }
    }

    function resolveCollisions() {
      nodesByBreadth.forEach(function(nodes) {
        var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

        // Push any overlapping nodes down.
        nodes.sort(ascendingDepth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
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
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
    }

    function ascendingDepth(a, b) {
      return a.y - b.y;
    }
  }/////jixiangyu  the vertival value??  consider the source code of d3  d3.nest()

  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        sy += link.dy1;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy2;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }/////jixiangyu   the algo test : 

  function value(link) {
    return link.value;
  }

  function weight1(link) {
    return link.w1;
  }

  function weight2(link) {
    return link.w2;
  }

  return sankey;
};
