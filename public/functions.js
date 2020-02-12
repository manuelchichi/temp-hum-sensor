
function getLectures() {
	var api = "http://temp-hum-sensor.herokuapp.com/lectures?date1=2020-02-10&date2=2020-02-11";
	var dateStart = new Date();
	var dateEnd = new Date();
	$.getJSON(api, function(data) {
		$.each(data, function(i, item) {
                	$('<tr>').html(
                	"<td>" + data[i].temperature + "</td><td>" + data[i].humidity + "</td><td>" + data[i].date + "</td>" + "</tr>").appendTo('#lectureTable tbody');
        	});

	})
};
