

export const GetLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition) 
		
	} else { 
		// alert('Geolocation is not supported by this browser.');
		console.log('Geolocation is not supported by this browser.');
	}

}

const location = GetLocation();
console.log(location);

const showPosition = (position: any) => {
	const lat = position.coords.latitude;
	const lng = position.coords.longitude;
	return { lat, lng };
}

export const GetDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1);  // deg2rad below
	const dlng = deg2rad(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dlng / 2) * Math.sin(dlng / 2)
		;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	return d;
}

function deg2rad(deg: number) {
	return deg * (Math.PI / 180)
}

export const GetTotalAmount = (items: any[]) => {
	let totalAmount = 0;
	items.forEach((item) => {
		totalAmount += item.price;
	});
	return totalAmount;
}