import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

export function Map(): JSX.Element {
	return (
		<MapContainer zoom={3} maxZoom={6} minZoom={2} center={{ lat: 47.279229, lng: 0.527344 }} scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://degenesis.com">Degenesis</a>'
				url={`${process.env.PUBLIC_URL}/assets/tiles/{z}_{x}_{y}.jpg`}
				errorTileUrl={`${process.env.PUBLIC_URL}/assets/tiles/empty.jpg`}
			/>
			<Events />
		</MapContainer>
	);
}

function Events(): null {
	useMapEvents({
		dblclick: (event) => {
			console.log(`location: ${event.latlng}`);
		}
	});
	return null;
}