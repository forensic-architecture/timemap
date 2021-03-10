import React from "react";
import colors from "../../../../common/global";
import Box from "./Box";
import ResponsiveText from "./ResponsiveText";

function Events3D({
  getCategoryColor,
  categories,
  projectPoint,
  styleLocation,
  selected,
  narrative,
  onSelect,
  svg,
  locations,
}) {
  // locations.map(l => console.log( "----", getCategoryColor(l.category)) )

  const selected_locations = selected.map((e) =>
    e.location.split("-")[0].trim()
  );
  console.log("selected_locations", selected_locations);

  const locations_floor = {
    "Off site": 20,
    S0E: 0,
    "000": -5,
    "016": 1,
    "092": 9,
    "095": 9,
    115: 11,
    133: 13,
    194: 18,
    205: 19,
    L0E: -5,
    L02: 2,
    L03: 3,
    L04: 4,
    L07: 7,
    L09: 9,
    L10: 10,
    L16: 16,
    L20: 19,
    LB0: 0,
    LF10: 10,
    S0E: 0,
    S03: 3,
    S12: 12,
    "n/a": 20,
  };

  const selectedIDs = selected.map((e) => e.id);

  function renderLocation_old(location) {
    if (!location.latitude || !location.longitude) return null; // don't render events with no location

    // find out if the location is selected!
    const selectedEventsAtLocation = location.events.filter((e) =>
      selectedIDs.includes(e.id) ? e.id : false
    );
    const isSelected = selectedEventsAtLocation.length > 0;
    const color = isSelected
      ? colors.primaryHighlight
      : getCategoryColor(location.category);

    function addTag() {
      return isSelected ? (
        <ResponsiveText
          content={selectedEventsAtLocation[0].id}
          position={[location["latitude"], 7 + 1.2, location["longitude"]]}
          lookAt={[10, 0, 0]}
        />
      ) : null;
    }

    return (
      <React.Fragment>
        <Box
          color={color}
          position={[location["latitude"], 7, location["longitude"]]}
          onClick={!narrative ? () => onSelect(location.events) : null}
        />
        {/* <ResponsiveText content={"here"} /> */}
        {addTag()}
      </React.Fragment>
    );
  }

  function renderLocation(location) {
    const fa_red = "#e41b14";
    // function addTag() {
    //   return isSelected ? (
    //     <ResponsiveText
    //       content={selectedEventsAtLocation[0].id}
    //       position={[location["latitude"], 7 + 1.2, location["longitude"]]}
    //       lookAt={[10, 0, 0]}
    //     />
    //   ) : null;
    // }

    return (
      <React.Fragment>
        <Box
          color={"#fff"}
          position={[
            Math.random() * 12,
            (locations_floor[location] + 5) * 3,
            Math.random() * 12,
          ]}
          // onClick={!narrative ? () => onSelect(location.events) : null}
        />
        {/* <ResponsiveText content={"here"} /> */}
        {/* {addTag()} */}
      </React.Fragment>
    );
  }

  return selected_locations.map(renderLocation);
}

export default Events3D;
