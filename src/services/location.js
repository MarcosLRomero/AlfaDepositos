import * as Location from "expo-location";

export const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    return {
      latitude: 0,
      longitude: 0,
    };
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
    maximumAge: 10000,
    timeout: 5000,
  });

  // console.log(location);
  // let location = await Location.getLastKnownPositionAsync({});

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy,
    altitude: location.coords.altitude,
    speed: location.coords.speed,
    timestamp: location.timestamp,
  };
};
