import React, { useCallback, useRef, useEffect } from "react";
const SearchBox = ({ mapApi,  setState }) => {
  const input = useRef(null);
  const searchBox = useRef(null);

  const handleOnPlacesChanged = useCallback(() => {
    const places = searchBox.current.getPlaces();
    if (places) {
      let targetObj = {
        name: places[0].name,
        lat: places[0].geometry.location.lat(),
        lng: places[0].geometry.location.lng(),
      };
      setState(targetObj);
    }
  }, [searchBox,setState]);

  useEffect(() => {
    if (!searchBox.current && mapApi) {
      searchBox.current = new mapApi.places.SearchBox(input.current);
      searchBox.current.addListener("places_changed", handleOnPlacesChanged);
    }

    return () => {
      if (mapApi) {
        searchBox.current = null;
        mapApi.event.clearInstanceListeners(searchBox);
      }
    };
  }, [mapApi, handleOnPlacesChanged]);

  return <input ref={input} placeholder="Search.." type="text" />;
};
export default SearchBox;
