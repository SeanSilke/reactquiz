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
        "После введения акциза газировка обязательно подорожает.",
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

var QElem = React.createClass({

    componentDidMount() {
      this.changeHeight();
      window.addEventListener('resize', this.changeHeight);
    },

    componentDidUpdate: function(){
      this.changeHeight();
    },

    changeHeight(){
      var count = document.querySelector(".questions .header .count");
      var title = document.querySelector(".questions .header .title");
      count.style.height = title.clientHeight;
      count.style.lineHeight = title.clientHeight + "px";
    },

  render() {
    let headerString = ((this.props.step + 1) + "/" + (this.props.total))

    return (
      <div key = {this.props.step} className="conteiner questions">
            <div className="header">
              <div className="count">{headerString}</div>
              <div className="title" > {this.props.question.title} </div>
            </div>
            {this.renderOptions()}
      </div>
    )
  },

  renderOptions() {
    return (
      <div className = "options">
      {this.props.question.options.map((option, index) => {
        return (<div key = {index} className="item" onClick = {this.props.callBack.bind(null,index)} >
                  <div className="check"></div>
                  <div className="text">{option}</div>
                </div>)
      })}
      </div>)
  }
})

var QBox = React.createClass({

    sendHeightToParent(){
      var conteiner =  document.getElementsByClassName('conteiner')[0]
      if (window.parent && window.parent.postMessage){
      window.parent.postMessage('inf-resize:' + conteiner.offsetHeight, "*")
      }
    },

    componentDidMount() {
      this.sendHeightToParent();
      window.addEventListener('resize', this.sendHeightToParent());
    },

    componentDidUpdate: function(){
      this.sendHeightToParent();
    },

  render() {
    let thanks = (
      <div key = {-1} className="thank conteiner">
        <div className="text">Спасибо за участие в&nbsp;опросе</div>
      </div>
    )

    return (
      <ReactCSSTransitionGroup transitionEnterTimeout ={300} transitionLeaveTimeout = {200} transitionName="example">
            {this.state.end ? thanks :
                              <QElem step={this.state.step}
                                     total = {this.state.questions.length}
                                     question={this.state.questions[this.state.step]}
                                     callBack={this.answer}
                              />}
        </ReactCSSTransitionGroup>
      )
  },

  answer(id){
    //!!NEVER mutate this.state directly,
    this.state.user_answers.push(id)
    this.nextQuestion()
  },

  nextQuestion(){
    if (this.state.step === this.state.questions.length - 1){
      this.setState({
        end: true
      });
      this.onQuizEnd();
    }else (
      this.setState({
        step: this.state.step + 1
      })
    )
  },

 onQuizEnd() {
        //send user answers to the server
        const oReq = new XMLHttpRequest();
        const url = (arr) => arr.map((v,i)=> "q" + i + "="+v ).join("&")
        oReq.open("GET", "./stat.n/save?" + url(this.state.user_answers));
        oReq.send();
  },

  getInitialState(){
    return {
      questions: questions,
      step: 0,
      user_answers: [],
      end: false
    }
  }

})


ReactDOM.render(
  <QBox />,
  document.getElementById('root')
);
