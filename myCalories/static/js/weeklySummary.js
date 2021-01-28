function parseWeeklyData(newWeek, lang) {
    $.ajax({
        headers: {"X-CSRFToken": Cookies.get('csrftoken')},
        type: 'POST',
        url: "post/ajax/weeklySummary",
        data: {'date': newWeek},
        success: function (response) {
            const prev_week = response['prev_week'];
            const act_week = response['act_week'];
            const next_week = response['next_week'];

            document.getElementById('prev_week').innerHTML = prev_week[0] + ' - ' + prev_week[6];
            document.getElementById('prev_week').onclick = function () {parseWeeklyData(prev_week[0], lang)};

            document.getElementById('act_week').innerHTML = act_week[0] + ' - ' + act_week[6];

            document.getElementById('next_week').innerHTML = next_week[0] + ' - ' + next_week[0];
            document.getElementById('next_week').onclick = function () {parseWeeklyData(next_week[0], lang)};

            weeklyNutrition(response['daily_list'], lang);
            popularFoods(response['popular_foods'], lang);
        }
    })
}

function weeklyNutrition(daysSummaries, lang) {
    let caloriesRow = '';
    let fatsRow = '';
    let proteinsRow = '';
    let carbohydratesRow = '';

    if (lang === "pl") {
        caloriesRow += '<td>Kalorie:</td>';
        fatsRow += '<td>Tłuszcze:</td>';
        proteinsRow += '<td>Białka:</td>';
        carbohydratesRow += '<td>Węglowodany:</td>';
    } else {
        caloriesRow += '<td>Calories:</td>';
        fatsRow += '<td>Fats:</td>';
        proteinsRow += '<td>Proteins:</td>';
        carbohydratesRow += '<td>Carbohydrates:</td>';
    }

    daysSummaries.forEach(function (food){
        let parsedFood = JSON.parse(food);

        caloriesRow += '<td>' + parsedFood['calories'] + 'kcal</td>';
        fatsRow += '<td>' + parsedFood['fat'] + 'g</td>';
        proteinsRow += '<td>' + parsedFood['protein'] + 'g</td>';
        carbohydratesRow += '<td>' + parsedFood['carbohydrates'] + 'g</td>';
    })


    document.getElementById("weekly_calories").innerHTML = caloriesRow;
    document.getElementById("weekly_fats").innerHTML = fatsRow;
    document.getElementById("weekly_carbohydrates").innerHTML = carbohydratesRow;
    document.getElementById("weekly_proteins").innerHTML = proteinsRow;

}

function popularFoods(foodList, lang) {
    let tbody = '<tr>';

    foodList.forEach(function (food) {
        let parsedFood = JSON.parse(food);
        let unit = parsedFood['unit']

        if (unit === "g") {
            unit = "x 100g"
        } else {
            if (lang === "pl") unit = "szt";
        }


        tbody += '<td>';
        if (lang === "pl") {
            tbody += parsedFood['name_pl'];
        } else {
            tbody += parsedFood['name'];
        }

        tbody += '</td><td>' + parsedFood['count'] + unit + '</td>';
    })

    tbody += '</tr>'
    document.getElementById("popular_foods").innerHTML = tbody;
}
