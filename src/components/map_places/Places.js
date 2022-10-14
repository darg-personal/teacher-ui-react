import { useLoadScript } from "@react-google-maps/api";
import Map from "./mixins";


export default function Places() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBj3kH49XHfCCD6S_TNriXuIMhkczchZXM"
  });

  return isLoaded ? <Map /> : null;
}