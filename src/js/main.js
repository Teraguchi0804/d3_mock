var d3 = require("d3");

var width = 1280,
    height = 800;

// 読み込みデータファイル
var DATA_FILE_PATH = './miserables.json';


//セレクト
var svg = d3.select("svg");
    width = +svg.attr("width");
    height = +svg.attr("height");

window.console.log("svg", svg);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody()) //クーロン力/万有引力
    .force("center", d3.forceCenter(width / 2, height / 2));  //重力の設定：世界の中心に落ちていく力


d3.json(DATA_FILE_PATH, function(error, graph) { //jsonからデータを読み込み
  if (error) throw error; //json読み込みエラーの場合はエラーを返す

  //nodeとnodeを結ぶ線を描画
  var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line") //セレクト
      .data(graph.links) //データバインド
      .enter().append("line") //足りない要素を追加
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  //nodeを表す円を描画
  var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle") //セレクト
      .data(graph.nodes) //データバインド
      .enter().append("circle") //足りない要素を追加
      .attr("r", 5) //円の半径
      .attr("fill", function(d) { return color(d.group); })　//円を塗り潰し:グループごとに同じ色で
      .call(d3.drag() //ドラッグのコールバック
          .on("start", dragstarted) //イベントリスナー：ドラッグ開始
          .on("drag", dragged) //イベントリスナー：ドラッグ中
          .on("end", dragended)); //イベントリスナー：ドラッグ終了

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  //再描画時に(tickイベント発生時)に線を描画
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});

//ドラッグ開始
function dragstarted(d) {
  // window.console.log('Start!!');
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

//ドラッグ中
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

//ドラッグ
function dragended(d) {
  // window.console.log('Ended!!');
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}