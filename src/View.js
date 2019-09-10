import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
  addWeatherMsg,
  weatherInputMsg,
  deleteWeatherMsg
} from "./Update"

const { div, h1, pre, ul, li, i, form, label, input, button } = hh(h);

function infoBox(mainClassName, label, value) {
  return (
    div({className: mainClassName}, [
      div({className: "f7 b"}, label),
      div({className: ""}, value),
    ])
  )
}

const weatherView = R.curry((dispatch, weather) => {
  const { location, temp, low, high } = weather

  return (
    li({className: "pa3 bb b--light-silver flex justify-between relative"}, [
      infoBox("w-60 tl", "location", location),
      infoBox("w-10 tc", "Temp", temp),
      infoBox("w-10 tc", "Low", low),
      infoBox("w-10 tc mr2", "High", high),
      i({
        className: "relative top--1 right--1 mt1 mr1 fa fa-remove pointer black-40",
        onclick: e => dispatch(deleteWeatherMsg(location))
      })
    ])
  )
}) 

function showWeathers(dispatch, model) {
  const { weathers } = model

  const weathersView = R.map(weatherView(dispatch), weathers)

  return weathersView;
}

function locationForm(dispatch, model) {
  const { location } = model
  return (
    form(
      {
        className: "",
        onsubmit: e => {
          e.preventDefault();
          dispatch(addWeatherMsg(e.target.value));
        },
      },
      [
        label({className: "f6 b db mb2"}, "Location"),
        input({className: "pa2 w-60", value: location, oninput: e => dispatch(weatherInputMsg(e.target.value))}),
        button({className: "pv2 ph3 br1", type: "submit"}, "Add")
      ]
    )
  )
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Weather'),
    div({className: ""}, [
      locationForm(dispatch, model)
    ]),
    ul({className: "list pl0 ml0 ba b--light-silver br"},[
      showWeathers(dispatch, model)
    ]),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
