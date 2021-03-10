import React, { useRef, useState } from "react";
// import { useInView } from "react-intersection-observer";
import { InView } from "react-intersection-observer";

export default function Scrollers(props) {
  const events = props.events;

  // events.map((event, index) => {
  //   events_highlights_mask.push(false);
  // });

  const getHighlightsList = (selected) => {
    const events_highlights_mask = [];
    selected.map((event, index) => {
      events_highlights_mask.push(false);
    });
    return events_highlights_mask;
  };

  const events_highlights_mask = getHighlightsList(events);

  const [inView, setInView] = React.useState(false);

  const narrativeWrapperStyle = {
    fontSize: 30,
    color: "yellow",
    position: "absolute",
    overflow: "scroll",
    marginLeft: "150px",
  };

  const narrativeElementStyle = {
    height: "101vh",
    width: "100vw",
  };

  let text = "";

  const getHighlights = (events_highlights_mask) => {
    const listy = events.filter(
      (event, index) => events_highlights_mask[index] === true
    );
    return listy;
  };

  const getHighlightTags = (eventList) => {
    let tag = "-";
    eventList.map((event) => {
      tag += event.associations + " -- ";
      tag += event.description;
    });
    return tag;
  };

  /* (() =>
                console.log(
                  getHighlightTags(getHighlights(events_highlights_mask))
                )) &&
                */

  return (
    <div style={narrativeWrapperStyle} inView={inView}>
      {events.map((event, index) => {
        return (
          <InView
            onChange={
              setInView &&
              (() => props.callbackFromParent(events_highlights_mask))
            }
          >
            {({ ref, inView }) => (
              <div style={narrativeElementStyle}>
                {(events_highlights_mask[index] = inView)}
                <h1 ref={ref}>
                  {inView ? event.location + text : event.location + text}
                </h1>
              </div>
            )}
          </InView>
        );
      })}
    </div>
  );

  // return (
  //   <div style={narrativeWrapperStyle} inView={inView}>
  //     {events.map((event) => {
  //       return (
  //         <div style={narrativeElementStyle} ref={ref}>
  //           <h1>{inView ? "You're in" : "you're out"}</h1>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}
