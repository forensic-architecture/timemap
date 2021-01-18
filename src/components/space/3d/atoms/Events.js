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

  const selectedIDs = selected.map((e) => e.id);

  function renderLocation(location) {
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

  return locations.map(renderLocation);
}

export default Events3D;
