
var rootElem =  document.getElementById('root');

(function(){
var  height = window.innerHeight;

var on  = function () {
  var count = document.querySelector(".questions .header .count");
  var title = document.querySelector(".questions .header .title");
  count.style.height = title.clientHeight;
  count.style.lineHeight = title.clientHeight + "px";
}

var doFunc = function(e) {
  on();
  if (window.innerHeight !== height) {
    // console.log("Height is changed");
    height = window.innerHeight
    window.parent.postMessage('inf-resize:' + height, "*")
  }else {
    // console.log("Height is'n changed")
  }
}

window.onresize = doFunc;

})();




var React = require('react');
var ReactDOM = require('react-dom');

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

let   questions = [
    {
      title:"Как часто вы пьете сладкие газированные напитки?",
      options: [
        "Часто (1-2 раза в неделю).",
        "Редко (не более 2 раз в месяц).",
        "Не пью совсем."
      ]
    },
    {
      title: "Как вы оцениваете последствия введения акциза на сладкие газированные напитки?",
      options: [
        "После введения акциза газировки обязательно подорожают.",
        "Думаю, что цена на полке в магазине не изменится.",
        "Скорее всего, отечественную продукцию вытеснит аналогичная из стран ближнего зарубежья, например, Казахстана и Беларуси, где никаких акцизов нет",
      ]
    },
    {
      title: "Поддерживаете ли вы введение акцизов на сладкие газированные напитки?",
      options: [
        "Да, мне кажется, это разумная мера.",
        "Нет, людям придется покупать газировку по более высокой цене.",
        "Я считаю, что покупатель должен обладать свободой выбора товаров."
      ]
    },
    {
      title: "Станут ли россияне меньше пить газированные напитки, если на них введут акцизы?",
      options: [
        "Скорее всего, да.",
        "Нет. Тот, кто пил, продолжит это делать, даже если баночка газировки подорожает на 5-10 рублей.",
        "Потребители будут искать другие аналоги газированным напиткам"
      ]
    },
    {
      title: "Если подорожают газированные напитки вследствие повышения акцизов, что люди будут пить?",
      options: [
        "Алкоголь (в частности пиво).",
        "Заменят более дешевыми безалкогольными газированными напитками, которые, возможно, будут более низкого качества.",
        "Возрастет число поддельных и контрафактных напитков.",
        "Все вышеперечисленное."
      ]
    },
  ]


var Header = React.createClass({

  componentDidMount: function() {
    var count = document.querySelector(".questions .header .count");
    var title = document.querySelector(".questions .header .title");
    count.style.height = title.clientHeight;
    count.style.lineHeight = title.clientHeight + "px";
  },
  render: function() {
    return (
      <div className="header">
        <div className="count">{this.props.count}</div>
        <div className="title" > {this.props.title} </div>
      </div>
    );
  }
});

var Item = React.createClass({
  render: function() {
    return (
      <div className="item" onClick = {this.props.callBack}>
        <div className="check" ></div>
        <div className="text"> {this.props.text}</div>
      </div>
    );
  }
});


var QBox = React.createClass({

  getInitialState: function(){
  return {
      data: questions[0],
      user_answers: [],
      step: 0
    }
  },

  onQuizEnd : function () {
      //send user answers to the server
      const oReq = new XMLHttpRequest();
      const url = (arr) => arr.map((v,i)=> "q" + i + "="+v ).join("&")
      oReq.open("GET", "./stat.n/save?" + url(this.state.user_answers));
      oReq.send();
  },

  render: function() {

    if ( this.state.step === 5 ) {
      this.onQuizEnd();
      return (<div className="thank conteiner">
              <div className="text">Спасибо за участие в опросе</div>
            </div>)
    }

    let that = this;

    var itemNodes = this.state.data.options.map(function(text,id) {
      return (
          <Item key={id} text = {text}  callBack = {
            ()=>{
              let newStep = that.state.step + 1;
              that.state.user_answers.push(id);
              that.setState({
                            step: newStep,
                            data: questions[newStep],
                          })
            }
          } />
      );
    });



    return (
      <ReactCSSTransitionGroup transitionEnterTimeout ={300} transitionLeaveTimeout = {300} transitionName="animation">
      <div key = {this.state.step} className="conteiner questions">
        <Header title={this.state.data.title}
                count={this.state.step + 1 + "/5"}/>
        <div className = "options">
          {itemNodes}
        </div>
      </div>
      </ReactCSSTransitionGroup>
    );
  }
});
ReactDOM.render(
  <QBox />,
  document.getElementById('root')
);
