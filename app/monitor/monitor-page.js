const app              = require("@nativescript/core").Application;
const getViewById      = require("@nativescript/core").getViewById;
const observableModule = require("tns-core-modules/data/observable");
const Observable       = require("tns-core-modules/data/observable").Observable;
const builder          = require("tns-core-modules/ui/builder");
let   frameModule      = require("tns-core-modules/ui/frame");
const appSettings      = require("application-settings");
const getFrameById     = require("tns-core-modules/ui/frame").getFrameById;
const platformModule   = require("tns-core-modules/platform");

// const mdc             = require("nativescript-bottom-navigation");


//--global

let token;
let reload = true
let role
let names
let names2 
let page
let common
let container
let viewModel = new Observable();
let layouts
let pl = ""


function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    let drawer       = getViewById(sideDrawer, "sideDrawer");
    drawer.showDrawer();
}
exports.onDrawerButtonTap = onDrawerButtonTap;

// function onItemLoading(args) {
//     // console.log(layouts)
//     args.view.addChild(layouts[args.index])
//     console.log(args.view)
//     // console.log()
// }

//exports.onItemLoading = onItemLoading;

function onEditButtonTap(args) {
    //const frame = getFrameById("framecard");
    const frame = args.object.page.frame;
    frame.navigate({
        moduleName: 'edit/edit-page',
        transition: {
            name: "fade"
        },
        context: {
            names2: names2,
            names: names
        },                            
        backstackVisible: true,
        clearHistory: false
    });

}
exports.onEditButtonTap = onEditButtonTap;

// function onTabSelected(args) {
//   // console.log(args.newIndex)
//   if(args.newIndex === 1){
//     //const frame = getFrameById("framecard");
//     const frame = args.object.page.frame;
//     // console.log(frame)
//     frame.navigate({
//         moduleName: 'menu-outofstock/menu-outofstock-page',
//         transition: {
//             name: "fade"
//         },
//         // context: {
//         //     names2: names2,
//         //     names: names
//         // },                            
//         backstackVisible: false,
//         clearHistory: true
//     });
//   }
// }
// exports.onTabSelected = onTabSelected;


function onRefreshButtonTap(args) {

    token = appSettings.getString("token");
    role = appSettings.getString("isDirector");
    //viewModel.set("process", true)

    names   = []
    names2  = {}
    layouts = []
    common = []

    page.bindingContext = viewModel;

    // viewModel.set("vis", mdc.TitleVisibility.Always)
    if (role=="isdirectorbr") viewModel.set("menu_show", "visible")
    else viewModel.set("menu_show", "collapse")

    container           = page.getViewById('container');
    container.removeChildren()

    if (token=="" && username=="test") {
      pl = JSON.parse(jsstr)
      //viewModel.set("process", false)
      let edit = page.getViewById('edit');
      edit.visibility = 'collapse'
      drawTales()  
    } 
    else {    
      let str_g = "https://gc.teacode.com/jsonapi/v7/monitortiles?mobile=q&token="+token;
      console.log(str_g)
      fetch(str_g)
        .then((response) => response.text())
          .catch((e)=> {
            console.log("Error3 " + e)
            //viewModel.set("process", false)
            let t = {}
            t.text = "Нет подключения к серверу. Проверьте соединение с интернетом или обратитесь к администратору"
            container.removeChildren()
            const emp = builder.load({
              path: '~/components/empty',
              name: 'empty',
              attributes: {
                bindingContext: t
              }
            });
            container.addChild(emp)
            throw new Error()
            })
          .then((data) => {  
            //viewModel.set("process", false)
            pl = JSON.parse(data);
            drawTales()
          })
          .catch((e) => {
            if ((e).toString()!="Error") {
                console.log("Error2 " + e)
                //viewModel.set("process", false)
                let t = {}
                t.text = "Ошибка! Обратитесь к администратору системы"
                container.removeChildren()
                const emp = builder.load({
                  path: '~/components/empty',
                  name: 'empty',
                  attributes: {
                    bindingContext: t
                  }
                });
                container.addChild(emp)
            } 
          });
    }                
}
exports.onRefreshButtonTap = onRefreshButtonTap;

// //let jsstr = '{"_struct_":"jsonapi/model/v6/TileList","tiles":[{"_struct_":"jsonapi/model/v6/Tile","num":[1],"face":[1],"size":[1],"type":["common"],"title":["ОБЩИЕ СВЕДЕНИЯ"],"parts":[{"_struct_":"jsonapi/model/v6/TilePart","num":[1],"title":["Товарооборот"],"value":["6894.34"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePart","num":[2],"title":["Средний чек"],"value":["304.33"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePart","num":[3],"title":["Всего покупок"],"value":[61],"unitm":[""]}]},{"_struct_":"jsonapi/model/v6/Tile","num":[2],"face":[1],"size":[2],"type":["turn"],"title":["ТОВАРООБОРОТ"],"parts":[{"_struct_":"jsonapi/model/v6/TilePart","num":[1],"title":["ТО"],"value":["6894.34"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePart","num":[2],"title":["От общего ТО"],"value":["0.44"],"unitm":["%"]},{"_struct_":"jsonapi/model/v6/TilePartPlot","num":[3],"title":[""],"plot":[{"_struct_":"jsonapi/model/v6/Plot","title":["Товарооборот"],"traces":[{"_struct_":"jsonapi/model/v6/PlotTrace","title":[],"x":[1554422400000,1554508800000,1554595200000],"y":[2529.58,2155.26,2209.5],"text":[],"yaxis":[]}],"xTitle":["день"],"yTitle":["ТО"],"xType":["Date"],"yType":["Real"]}],"plotType":["barstack"]}]},{"_struct_":"jsonapi/model/v6/Tile","num":[3],"face":[1],"size":[1],"type":["turnunit"],"title":["ТОВАРООБОРОТ В ЕДИНИЦАХ"],"parts":[{"_struct_":"jsonapi/model/v6/TilePartPlot","num":[1],"title":[""],"plot":[{"_struct_":"jsonapi/model/v6/Plot","title":["Товарооборот"],"traces":[{"_struct_":"jsonapi/model/v6/PlotTrace","title":[],"x":[1561939200000,1562025600000,1562112000000,1562198400000,1562284800000,1562371200000,1562457600000,1562544000000,1562630400000,1562716800000,1562803200000,1562889600000,1562976000000,1563062400000,1563148800000,1563235200000,1563321600000,1563408000000,1563494400000,1563580800000,1563667200000,1563753600000,1563840000000,1563926400000,1564012800000,1564099200000,1564185600000,1564272000000],"y":[1,3,5,6,8,5,4,6,1,5,6,8,9,7,5,6,9,7,3,5,7,6,8,4,6,4,5,9],"text":[],"yaxis":[]}],"xTitle":["день"],"yTitle":["ТО"],"xType":["Date"],"yType":["Real"]}],"plotType":["line"]}]},{"_struct_":"jsonapi/model/v6/Tile","num":[4],"face":[1],"size":[2],"type":["averagerec"],"title":["СРЕДНИЙ ЧЕК"],"parts":[{"_struct_":"jsonapi/model/v6/TilePartPlot","num":[1],"title":[""],"plot":[{"_struct_":"jsonapi/model/v6/Plot","title":["Средний чек"],"traces":[{"_struct_":"jsonapi/model/v6/PlotTrace","title":[],"x":[1554422400000,1554508800000,1554595200000],"y":[326.34,307.85,278.76],"text":[],"yaxis":[]}],"xTitle":["день"],"yTitle":["ср.чек, ₽"],"xType":["Date"],"yType":["Real"]}],"plotType":["barstack"]},{"_struct_":"jsonapi/model/v6/TilePart","num":[2],"title":["Позиций в чеке"],"value":["3.90"],"unitm":[""]},{"_struct_":"jsonapi/model/v6/TilePart","num":[3],"title":["Стоимость позиции"],"value":["78.04"],"unitm":["₽"]}]},{"_struct_":"jsonapi/model/v6/Tile","num":[5],"face":[1],"size":[2],"type":["brtop"],"title":["ЛИДЕРЫ ПО ТО: МАГАЗИНЫ"],"parts":[{"_struct_":"jsonapi/model/v6/TilePartTop","num":[1],"title":[""],"top":[{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[1],"text":["72 Ангарск4 - Ангарск г, 13-й мкр, №33"],"value":["6894.34"],"unitm":["₽"]}],"antitop":[]}]},{"_struct_":"jsonapi/model/v6/Tile","num":[6],"face":[1],"size":[2],"type":["brtop"],"title":["ЛИДЕРЫ ПО ТО: ТОВАРЫ"],"parts":[{"_struct_":"jsonapi/model/v6/TilePartTop","num":[1],"title":[""],"top":[{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[1],"text":["Масло Злато подсолнечное 1л"],"value":["2170.86"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[2],"text":["Масло подсолнечное рафинированное ПРОСТОЙ ВЫБОР 0,8л"],"value":["2033.51"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[3],"text":["Масло РОСТ оливковое экстра вирджин 250мл ст/б"],"value":["1532.17"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[4],"text":["Масло РОСТ оливковое экстра вирджин 500мл ст/б"],"value":["433.43"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[5],"text":["Масло льняное. Масляный король 350мл"],"value":["146.90"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[6],"text":["Масло Янта Подсолнечное нераф 0.5л"],"value":["138.11"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[7],"text":["Масло Золотая семечка подсолнечное раф 1л"],"value":["106.50"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[8],"text":["Масло Кубаночка 1л"],"value":["100.80"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[9],"text":["Масло Янта Соевое рафинир. дезодорированное 0.5л"],"value":["89.38"],"unitm":["₽"]},{"_struct_":"jsonapi/model/v6/TilePartTopItem","num":[10],"text":["Масло Янта Соевое рафинир. дезод 1л"],"value":["88.90"],"unitm":["₽"]}],"antitop":[]}]},{"_struct_":"jsonapi/model/v6/Tile","num":[7],"face":[1],"size":[2],"type":["brgroupto"],"title":["ТО ПО МАГАЗИНАМ"],"parts":[{"_struct_":"jsonapi/model/v6/TilePartPlot","num":[1],"title":[""],"plot":[{"_struct_":"jsonapi/model/v6/Plot","title":["ТО по магазинам"],"traces":[{"_struct_":"jsonapi/model/v6/PlotTrace","title":[],"x":[6894.34,6500,5500,6700.3,5956.56],"y":["48 Политех 2 - Иркутск г., Лермонтова ул., 90/1","62 Версаль - г. Иркутск, ул. Академическая, 31","Универсам 12 - Усолье-Сибирское г, ул. Ленина, 93А","32 Шелехов2 - Шелехов г, 1 мкрн., д. 45","Универсам 108 - Марково, Березовый, 115"],"text":[],"yaxis":[]}],"xTitle":["ТО, ₽"],"yTitle":[""],"xType":["Real"],"yType":["String"]}],"plotType":["barstackh"]}]},{"_struct_":"jsonapi/model/v6/Tile","num":[8],"face":[1],"size":[2],"type":["skugroupto"],"title":["ТО ПО ТОВАРАМ"],"parts":[{"_struct_":"jsonapi/model/v6/TilePartPlot","num":[1],"title":[""],"plot":[{"_struct_":"jsonapi/model/v6/Plot","title":["ТО по товарам"],"traces":[{"_struct_":"jsonapi/model/v6/PlotTrace","title":[],"x":[6894.34,5683.5,6300.47],"y":["МАСЛО РАСТИТЕЛЬНОЕ","Зажигалка Крикет Стандарт","Зажигалка Феодор"],"text":[],"yaxis":[]}],"xTitle":["ТО, ₽"],"yTitle":[""],"xType":["Real"],"yType":["String"]}],"plotType":["barstackh"]}]}]}'
// //let jsstr = '{ "_struct_": "jsonapi/model/v6/PinnedTileCalcList", "pinnedTilesCalc": [ { "_struct_": "jsonapi/model/v6/PinnedTileCalc", "id": ["479d1944-3add-4455-aac1-51081b80a367"], "glId": ["5b59de9a-e975-46fc-b209-d35fb8f8588e"], "date1": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564125161931], "zone": ["UTC"] } ], "date2": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564643561931], "zone": ["UTC"] } ], "tile": [ { "_struct_": "jsonapi/model/v6/Tile", "num": [1], "face": [1], "size": [1], "type": ["common"], "title": ["ОБЩИЕ СВЕДЕНИЯ (26.07.2019-01.08.2019)"], "parts": [ { "_struct_": "jsonapi/model/v6/TilePart", "num": [1], "title": ["Товарооборот"], "value": ["0.00"], "fvalue": ["₽ 0.00"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePart", "num": [2], "title": ["Средний чек"], "value": ["0.00"], "fvalue": ["₽ 0.00"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePart", "num": [3], "title": ["Всего покупок"], "value": [0], "fvalue": ["0"], "unitm": [""] } ] } ] }, { "_struct_": "jsonapi/model/v6/PinnedTileCalc", "id": ["76fe84c2-c794-475a-9961-56a75cb4cbe4"], "glId": ["5b59de9a-e975-46fc-b209-d35fb8f8588e"], "date1": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564125167031], "zone": ["UTC"] } ], "date2": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564643567031], "zone": ["UTC"] } ], "tile": [ { "_struct_": "jsonapi/model/v6/Tile", "num": [2], "face": [1], "size": [2], "type": ["turn"], "title": ["ТОВАРООБОРОТ (26.07.2019-01.08.2019)"], "parts": [ { "_struct_": "jsonapi/model/v6/TilePart", "num": [1], "title": ["ТО"], "value": ["0.00"], "fvalue": ["₽ 0.00"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePart", "num": [2], "title": ["От общего ТО"], "value": ["0.00"], "fvalue": ["% 0.00"], "unitm": ["%"] }, { "_struct_": "jsonapi/model/v6/TilePartPlot", "num": [3], "title": [""], "plot": [ { "_struct_": "jsonapi/model/v6/Plot", "title": ["Товарооборот"], "traces": [ { "_struct_": "jsonapi/model/v6/PlotTrace", "title": [], "x": [1564099200000, 1564185600000, 1564272000000, 1564358400000, 1564444800000, 1564531200000, 1564617600000], "y": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "text": [], "yaxis": [] } ], "xTitle": ["день"], "yTitle": ["ТО"], "xType": ["Date"], "yType": ["Real"] } ], "plotType": ["barstack"] } ] } ] }, { "_struct_": "jsonapi/model/v6/PinnedTileCalc", "id": ["8bc9d39b-16be-4624-9a95-57ca15d4b2c3"], "glId": ["5b59de9a-e975-46fc-b209-d35fb8f8588e"], "date1": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564125171927], "zone": ["UTC"] } ], "date2": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564643571927], "zone": ["UTC"] } ], "tile": [ { "_struct_": "jsonapi/model/v6/Tile", "num": [3], "face": [1], "size": [1], "type": ["turnunit"], "title": ["ТОВАРООБОРОТ В ЕДИНИЦАХ (26.07.2019-01.08.2019)"], "parts": [ { "_struct_": "jsonapi/model/v6/TilePartPlot", "num": [1], "title": [""], "plot": [ { "_struct_": "jsonapi/model/v6/Plot", "title": ["Товарооборот"], "traces": [ { "_struct_": "jsonapi/model/v6/PlotTrace", "title": [], "x": [1564099200000, 1564185600000, 1564272000000, 1564358400000, 1564444800000, 1564531200000, 1564617600000], "y": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "text": [], "yaxis": [] } ], "xTitle": ["день"], "yTitle": ["ТО"], "xType": ["Date"], "yType": ["Real"] } ], "plotType": ["barstack"] } ] } ] }, { "_struct_": "jsonapi/model/v6/PinnedTileCalc", "id": ["4216901f-5098-42bf-8d49-ad757bc05f95"], "glId": ["5b59de9a-e975-46fc-b209-d35fb8f8588e"], "date1": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564125176581], "zone": ["UTC"] } ], "date2": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564643576581], "zone": ["UTC"] } ], "tile": [ { "_struct_": "jsonapi/model/v6/Tile", "num": [4], "face": [1], "size": [2], "type": ["skugroupto"], "title": ["ТО ПО ТОВАРАМ (26.07.2019-01.08.2019)"], "parts": [ { "_struct_": "jsonapi/model/v6/TilePartPlot", "num": [1], "title": [""], "plot": [ { "_struct_": "jsonapi/model/v6/Plot", "title": ["ТО по товарам"], "traces": [ { "_struct_": "jsonapi/model/v6/PlotTrace", "title": [], "x": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "y": ["АЛКОГОЛЬ, ТАБАК", "БАКАЛЕЯ", "БЫТОВАЯ ХИМИЯ, ГИГИЕНА, КОСМЕТИКА", "ГАСТРОНОМ МЯСНОЙ", "ГАСТРОНОМ РЫБНЫЙ", "КОНДИТЕРСКИЙ", "МОЛОЧНЫЙ", "НОН ФУД БАЗА", "НОН ФУД СЕЗОН", "ОВОЩИ, ФРУКТЫ", "ПРОИЗВОДСТВО"], "text": [], "yaxis": [] } ], "xTitle": ["ТО, ₽"], "yTitle": [""], "xType": ["Real"], "yType": ["String"] } ], "plotType": ["barstackh"] } ] } ] }, { "_struct_": "jsonapi/model/v6/PinnedTileCalc", "id": ["3a97e4a3-f323-4dd9-9988-ede6db8a35b3"], "glId": ["5b59de9a-e975-46fc-b209-d35fb8f8588e"], "date1": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564125179562], "zone": ["UTC"] } ], "date2": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564643579562], "zone": ["UTC"] } ], "tile": [ { "_struct_": "jsonapi/model/v6/Tile", "num": [5], "face": [1], "size": [2], "type": ["brgroupto"], "title": ["ТО ПО МАГАЗИНАМ 2 (26.07.2019-01.08.2019)"], "parts": [ { "_struct_": "jsonapi/model/v6/TilePartPlot", "num": [1], "title": [""], "plot": [ { "_struct_": "jsonapi/model/v6/Plot", "title": ["ТО по магазинам"], "traces": [ { "_struct_": "jsonapi/model/v6/PlotTrace", "title": [], "x": [0.0], "y": ["ВСЕ МАГАЗИНЫ"], "text": [], "yaxis": [] } ], "xTitle": ["ТО, ₽"], "yTitle": [""], "xType": ["Real"], "yType": ["String"] } ], "plotType": ["barstackh"] } ] } ] }, { "_struct_": "jsonapi/model/v6/PinnedTileCalc", "id": ["8a015a46-cb5e-4c6d-af65-9af6240f36b4"], "glId": ["5b59de9a-e975-46fc-b209-d35fb8f8588e"], "date1": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564125183446], "zone": ["UTC"] } ], "date2": [ { "_struct_": "com/teacode/date/Date", "stamp": [1564643583446], "zone": ["UTC"] } ], "tile": [ { "_struct_": "jsonapi/model/v6/Tile", "num": [6], "face": [1], "size": [2], "type": ["brtop"], "title": ["ЛИДЕРЫ ПО ТО: МАГАЗИНЫ (26.07.2019-01.08.2019)"], "parts": [ { "_struct_": "jsonapi/model/v6/TilePartTop", "num": [1], "title": [""], "top": [ { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [1], "text": ["48 Политех 2 - Иркутск г., Лермонтова ул., 90/1"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [2], "text": ["62 Версаль - г. Иркутск, ул. Академическая, 31"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [3], "text": ["Универсам 12 - Усолье-Сибирское г, ул. Ленина, 93А"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [4], "text": ["32 Шелехов2 - Шелехов г, 1 мкрн., д. 45"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [5], "text": ["Универсам 108 - Марково, Березовый, 115"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] } ], "antitop": [ { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [244], "text": ["Универсам 47 - Слюдянка г, Советская ул, №19Б"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [245], "text": ["Универсам 36 - Братск г, Энергетик жилрайон, Погодаева ул, №14"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [246], "text": ["37 Култукская - Иркутск г, Култукская ул,13"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [247], "text": ["Универсам 85 - Иркутск г, Индустриальная ул, 16"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] }, { "_struct_": "jsonapi/model/v6/TilePartTopItem", "num": [248], "text": ["Универсам 129 - г. Саянск, Солнечная, 4"], "value": ["0.00"], "fvalue": ["₽ 0 E+1"], "unitm": ["₽"] } ] } ] } ] } ] }'
let jsstr = '{"_struct_":"jsonapi/model/v7/PinnedTileCalcList","pinnedTilesCalc":[{"_struct_":"jsonapi/model/v7/PinnedTileCalc","id":"d5d92bcf-e9ae-4bd7-8577-2512e14d1427","glId":"7feb6781-8494-4229-ba11-df3d5ebed081","date1":{"_struct_":"com/teacode/date/Date","stamp":1611878400000,"zone":"UTC"},"date2":{"_struct_":"com/teacode/date/Date","stamp":1611878400000,"zone":"UTC"},"tile":{"_struct_":"jsonapi/model/v7/Tile","num":2,"face":1,"size":1,"type":"turnhours2days","title":"ТОВАРООБОРОТ В РУБЛЯХ (2 ДНЯ) (29.01.2021)","parts":[{"_struct_":"jsonapi/model/v7/TilePartPlot","num":1,"title":"","plot":{"_struct_":"jsonapi/model/v7/Plot","title":"Товарооборот","traces":[{"_struct_":"jsonapi/model/v7/PlotTrace","title":"29.01.2021","x":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],"y":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,40,47.94,0.0,72.98,72.12,528.67, 340.58,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"text":[],"yaxis":null},{"_struct_":"jsonapi/model/v7/PlotTrace","title":"28.01.2021","x":["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],"y":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,25.29,53.99,269.86,428.57, 921.73,1052.59,364.64,807.28,1190.53,1051.09,1360.57,995.31,585.81,599.63,311.85,0.0],"text":[],"yaxis":null}],"xTitle":"","yTitle":[""],"xType":"String","yType":["Real"]},"plotType":"line","endDate":{"_struct_":"com/teacode/date/Date","stamp":1611878400000,"zone":"UTC"}}]},"visible":true,"position":2,"positionMobile":1},{"_struct_":"jsonapi/model/v7/PinnedTileCalc","id":"3d41f756-447c-46af-bf6e-74ba8f041a3b","glId":"7feb6781-8494-4229-ba11-df3d5ebed081","date1":{"_struct_":"com/teacode/date/Date","stamp":1610928000000,"zone":"UTC"},"date2":{"_struct_":"com/teacode/date/Date","stamp":1612051200000,"zone":"UTC"},"tile":{"_struct_":"jsonapi/model/v7/Tile","num":3,"face":1,"size":2,"type":"compareweektable","title":"ТО ПО НЕДЕЛЯМ (18.01.2021-31.01.2021)","parts":[{"_struct_":"jsonapi/model/v7/TilePartTable","num":1,"tableTrHead":{"_struct_":"jsonapi/model/v7/TilePartTableTr","tilePartTableTrCells":[{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":""},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"Дата"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"ТО, руб"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"Дата"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"ТО, руб"}]},"tableTrContents":[{"_struct_":"jsonapi/model/v7/TilePartTableTr","tilePartTableTrCells":[{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"пн."},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"18.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 767"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"25.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 877"}]},{"_struct_":"jsonapi/model/v7/TilePartTableTr","tilePartTableTrCells":[{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"вт."},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"19.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 755"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"26.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 10 462"}]},{"_struct_":"jsonapi/model/v7/TilePartTableTr","tilePartTableTrCells":[{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"ср."},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"20.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 214"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"27.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 790"}]},{"_struct_":"jsonapi/model/v7/TilePartTableTr","tilePartTableTrCells":[{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"чт."},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"21.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 433"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"28.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 118"}]},{"_struct_":"jsonapi/model/v7/TilePartTableTr","tilePartTableTrCells":[{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"пт."},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"22.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 190"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"29.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 917"}]},{"_struct_":"jsonapi/model/v7/TilePartTableTr","tilePartTableTrCells":[{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"сб."},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"23.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 341"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"30.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 100"}]},{"_struct_":"jsonapi/model/v7/TilePartTableTr","tilePartTableTrCells":[{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"вс."},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"24.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 536"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"31.01"},{"_struct_":"jsonapi/model/v7/TilePartTableTrCell","fvalue":"₽ 50"}]}]}]},"visible":true,"position":3,"positionMobile":2},{"_struct_":"jsonapi/model/v7/PinnedTileCalc","id":"e9b16354-06be-4200-acb9-2b6c0faf54ff","glId":"2e052357-cafd-410a-bb01-5ed1bc4c058d","date1":{"_struct_":"com/teacode/date/Date","stamp":1611792000000,"zone":"UTC"},"date2":{"_struct_":"com/teacode/date/Date","stamp":1611792000000,"zone":"UTC"},"tile":{"_struct_":"jsonapi/model/v7/Tile","num":4,"face":1,"size":2,"type":"brtop","title":"ЛИДЕРЫ ПО ТО: МАГАЗИНЫ (28.01.2021)","parts":[{"_struct_":"jsonapi/model/v7/TilePartTop","num":1,"title":"","top":[{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":1,"text":"Магазин 1","value":"1272.60","fvalue":"₽ 1 272","unitm":"₽"},{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":2,"text":"Магазин 2","value":"675.00","fvalue":"₽ 675.0","unitm":"₽"},{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":3,"text":"Магазин 3","value":"675.00","fvalue":"₽ 675.0","unitm":"₽"},{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":4,"text":"Магазин 4","value":"675.00","fvalue":"₽ 675.0","unitm":"₽"},{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":5,"text":"Магазин 5","value":"675.00","fvalue":"₽ 675.0","unitm":"₽"}],"antitop":[{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":85,"text":"Магазин 6","value":"0.00","fvalue":"₽ 0.0","unitm":"₽"},{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":86,"text":"Магазин 7","value":"0.00","fvalue":"₽ 0.0","unitm":"₽"},{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":87,"text":"Магазин 8","value":"0.00","fvalue":"₽ 0.0","unitm":"₽"},{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":88,"text":"Магазин 9","value":"0.00","fvalue":"₽ 0.0","unitm":"₽"},{"_struct_":"jsonapi/model/v7/TilePartTopItem","num":89,"text":"Магазин 10","value":"0.00","fvalue":"₽ 0.0","unitm":"₽"}]}]},"visible":true,"position":4,"positionMobile":3},{"_struct_":"jsonapi/model/v7/PinnedTileCalc","id":"d992b987-5f33-40b4-beea-be916a9f8891","glId":"2e052357-cafd-410a-bb01-5ed1bc4c058d","date1":{"_struct_":"com/teacode/date/Date","stamp":1611792000000,"zone":"UTC"},"date2":{"_struct_":"com/teacode/date/Date","stamp":1611792000000,"zone":"UTC"},"tile":{"_struct_":"jsonapi/model/v7/Tile","num":5,"face":1,"size":2,"type":"averagerec","title":"СРЕДНИЙ ЧЕК (28.01.2021)","parts":[{"_struct_":"jsonapi/model/v7/TilePartPlot","num":1,"title":"","plot":{"_struct_":"jsonapi/model/v7/Plot","title":"Средний чек","traces":[{"_struct_":"jsonapi/model/v7/PlotTrace","title":null,"x":[1611792000000],"y":[370.46],"text":[],"yaxis":null}],"xTitle":"","yTitle":[""],"xType":"Date","yType":["Real"]},"plotType":"barstack","endDate":{"_struct_":"com/teacode/date/Date","stamp":1611792000000,"zone":"UTC"}},{"_struct_":"jsonapi/model/v7/TilePart","num":2,"title":"Позиций в чеке","value":"4.71","fvalue":"4.71","unitm":""},{"_struct_":"jsonapi/model/v7/TilePart","num":3,"title":"Стоимость позиции","value":"78.65","fvalue":"₽ 78.65","unitm":"₽"}]},"visible":true,"position":5,"positionMobile":4}]}';
// //let pl = JSON.parse(jsstr)

function onNavigatingTo(args) {
    viewModel.set("width", platformModule.screen.mainScreen.widthPixels)
    var page    = args.object;
    var gotData = page.navigationContext;
    if (gotData!=undefined && gotData.reload != undefined)
      reload = gotData.reload
}
exports.onNavigatingTo = onNavigatingTo;


function onPageLoaded(args) {

    role = appSettings.getString("isDirector");
    token    = appSettings.getString("token");
    username = appSettings.getString("username");
    console.log(role)
    page     = args.object;
    viewModel.set("process", true)

    names   = []
    names2  = {}
    layouts = []
    common  = {}

    page.bindingContext = viewModel;
    //viewModel.set("vis", mdc.TitleVisibility.Always)
    if (role=="isdirectorbr") {
      viewModel.set("menu_show", "visible")
      const sideDrawer = app.getRootView();
      let m       = getViewById(sideDrawer, "monitor");
      let out       = getViewById(sideDrawer, "outofstock");
      if (m!=undefined && out!=undefined) {
        m.className = "sidedrawer-list-item  selected"
        out.className = "sidedrawer-list-item"
      }
    } 
    else viewModel.set("menu_show", "collapse")
    container = page.getViewById('container');
    container.removeChildren()
 
    //let str = "http://192.168.1.162:9078/jsonapi/v6/gllist?token="+token

    if ((token=="" || token==undefined) && username=="test") {
      //let ref = page.getViewById('ref');
      
      pl      = JSON.parse(jsstr)
      viewModel.set("process", false)

      // let ref1 = page.getViewById('ref1');
      // ref1.visibility = 'collapse'
      let edit = page.getViewById('edit');
      edit.visibility = 'collapse'
      drawTales()  
    }
    else if (reload || pl=="") {
      let str_g = "https://gc.teacode.com/jsonapi/v7/monitortiles?mobile=q&token="+token;
        console.log(str_g)
        fetch(str_g)
          .then((response) => response.text())
          .catch((e)=> {
            console.log("Error3 " + e)
            viewModel.set("process", false)
            let t = {}
            t.text = "Нет подключения к интернету"
            container.removeChildren()
            const emp = builder.load({
              path: '~/components/empty',
              name: 'empty',
              attributes: {
                bindingContext: t
              }
            });
            container.addChild(emp)
            throw new Error()
            })
          .then((data) => {  
            viewModel.set("process", false)
            pl = JSON.parse(data);
            // console.log(pl)
            drawTales()
          })
          .catch((e) => {
            if ((e).toString()!="Error") {
                console.log("Error2 " + e)
                viewModel.set("process", false)
                let t = {}
                t.text = "Ошибка! Обратитесь к администратору системы"
                container.removeChildren()
                const emp = builder.load({
                  path: '~/components/empty',
                  name: 'empty',
                  attributes: {
                    bindingContext: t
                  }
                });
                container.addChild(emp)
            } 
          });
    }
    else {
      viewModel.set("process", false)
      drawTales()
      reload = true
    }                                
}


// function drawList() {
//   let listr = []  
//   for (let j=0; j<pl.pinnedTilesCalc.length; j++) 
//     listr.push("container"+j)
//   viewModel.set("items", listr)
// }

function drawTales() {
  let t2 = []
  if (pl.pinnedTilesCalc.length == 0) {
    let t = {}
    t.text = "Пока на мониторе ничего не закреплено"
    container.removeChildren()
    const emp = builder.load({
      path: '~/components/empty',
      name: 'empty',
      attributes: {
        bindingContext: t
      }
    });
    container.addChild(emp)
  }
  else {
    container.removeChildren()
    let hided = false;
    for (let j=0; j<pl.pinnedTilesCalc.length; j++) {
    // common.push({})
      let visible   = pl.pinnedTilesCalc[j].visible ? true : false;
      let className = visible ? "view" : "hide";
      let resImg    = visible ? "res://show" : "res://none";

      common.title = pl.pinnedTilesCalc[j].tile.title
      common.type  = pl.pinnedTilesCalc[j].tile.type
      common.parts = pl.pinnedTilesCalc[j].tile.parts
      common.id    = pl.pinnedTilesCalc[j].id
      common.plotType = "none"
      
      //names.push(common.title)
      t2.push({title: common.title, id:common.id, class:"card_edit " + className, res: resImg})

      if (visible) {
        hided = true;
        for (let i=0; i<common.parts.length; i++) {

          if ((common.parts[i]._struct_).toString() == "jsonapi/model/v7/TilePartMessage") {
            common.type = "message"
            common.text = common.parts[i].text
          }
          else
          if ((common.parts[i]._struct_).toString() == "jsonapi/model/v7/TilePartPlot") {
              let plot = []
              let plot2 = []
              let last
              let width = viewModel.get("width")
              common.plotType = common.parts[i].plotType

              arraycommonx = []
              arraycommony = []

              if (common.parts[i].plot.traces[1]!=undefined) {
                arraycommonx = common.parts[i].plot.traces[0].x.concat(common.parts[i].plot.traces[1].x)
                arraycommony = common.parts[i].plot.traces[0].y.concat(common.parts[i].plot.traces[1].y)
              }
              else {
                arraycommonx = common.parts[i].plot.traces[0].x
                arraycommony = common.parts[i].plot.traces[0].y
              }

              if (common.parts[i].plot.xType=="Real")  
                last = Math.max(...arraycommonx)
              else 
                last = Math.max(...arraycommony) 

              if (common.plotType=="barstack") {
                let k = width*0.2/common.parts[i].plot.traces[0].x.length
                // console.log(k)
                common.barsize = k
                // let s = common.parts[i].plot[0].traces[0].x.length
                // if (s<5) common.barsize = 100
                //   else if (s>4 && s<8) common.barsize = 45-s*2
                //     else common.barsize = 30-s
              }
              
              let divid = 1
              if (last/900000 >= 1 ) {
                divid = 1000000
                common.fstr = "млн"
              }
              else if (last/900 >= 1 ) {
                divid = 1000
                common.fstr = "тыс"
              }
              else {
                common.fstr = ""
              }

              common.units = common.fstr

              if (common.plotType == "line") {
                common.min = (Math.min(...arraycommony)-divid)/divid 
                common.min = Math.max(0, common.min)
              }
                

              if (last/divid <=10) common.fstr = "%.1f "+common.fstr
              else common.fstr = "%.0f "+common.fstr   

              if ((common.parts[i].plot.xType).toString()=="Date") {
                let numb = width/220
                let majorStep = Math.ceil(common.parts[i].plot.traces[0].x.length/numb)
                // console.log(majorStep)
                common.majorStep = majorStep
              } 
              else if (common.parts[i].plot.xType=="Real") {
                let numb = 160
                let majorStep = Math.ceil(last/divid/(Math.floor(width/numb)-1.5))
                if (last/divid > 10)
                majorStep = Math.ceil(majorStep/5)*5
                common.majorStep = majorStep
              }

              common.titles = []

              for (let z=0; z<common.parts[i].plot.traces.length; z++) {
                plot[z] = []
                
                common.titles[z] = common.parts[i].plot.traces[z].title


                for (let k=0; k<common.parts[i].plot.traces[z].x.length; k++) {
                if ((common.parts[i].plot.xType).toString()=="Date") {
                  //let newdate = new Date(parseInt(common.parts[i].plot[0].traces[0].x[k]))
                  let newdate = common.parts[i].plot.traces[z].x[k]
                  //     var year = date.getFullYear();
                  //     var month = date.getMonth() + 1;
                  //     if (month < 10) month = '0'+month
                  //     var day = date.getDate();
                  //     if (day < 10) day = '0'+day
                  //     var d =   weekdays[date.getDay()]
                  //     let newdate = day+"."+month+" "+d;
                  plot[z].push({x: newdate, y: +(common.parts[i].plot.traces[z].y[k]/divid).toFixed(2)})
                }
                else if ((common.parts[i].plot.xType).toString()=="Real") { 
                    plot[z].push({x: +(common.parts[i].plot.traces[z].x[k]/divid).toFixed(2), y: common.parts[i].plot.traces[z].y[k]})
                }
                else {
                  if (common.plotType=="barstack")
                    common.plotType = "stringbarstack"
                  if (common.plotType=="line") {
                    common.mti = Math.ceil(common.parts[i].plot.traces[z].x.length/8)
                    common.plotType = "stringline"
                  }  
                    plot[z].push({x: common.parts[i].plot.traces[z].x[k], y: +(common.parts[i].plot.traces[z].y[k]/divid).toFixed(2)})
                }                                              
                }
              }
              common.plot = plot
          }
        }
        let str = ""

        if (common.type=='brtop') {
          common.parts[0].top = common.parts[0].top.slice(0,3)
           let len = common.parts[0].top.length
           common.parts[0].antitop = common.parts[0].antitop.slice(0,6-len)
        }

        if (common.type=='turnhours2days') {
          common.plotType = "stringline2"
        }


        if (common.type=='compareweektable') {
          let rows = common.parts[0].tableTrContents;
          for (let ind=0; ind<rows.length; ind++) {
            if (ind%2 == 0) 
              rows[ind].class = "odd"
            else
              rows[ind].class = "noodd"
          }
        }

        switch((common.type).toString()) {
          case 'common': str = 'common'; break;
          case 'plancommon': str = 'common'; break;
          case 'turn': str = 'turnover'; break;
          case 'planturn': str = 'turnover'; break;
          case 'turnhours2days': str = 'to'; break;
          case 'averagerec': str = 'check'; break;
          case 'planaveragerec': str = 'check'; break;
          case 'brtop': str = "lead"; break;
          case 'planbrtop': str = "lead"; break;
          case 'brgroupto': str = 'to'; break;
          case 'planbrgroupto': str = 'to'; break;
          case 'skugroupto': str = 'to'; break;
          case 'planskugroupto': str = 'to'; break;
          case 'turnunit': str = 'to'; break;
          case 'planturnunit': str = 'to'; break;
          case 'message': str = 'message'; break;
          case 'compareweektable': str = 'tableweek'; break;
          default: str = 'cf';
        }

        if (str=="common" || str=="turnover" || str=="check" || str=="to" || str=="lead"  || str=="message" || str=="tableweek") {
        let test = builder.load({
          path: '~/components/'+str,
          name: str,
          attributes: {
            bindingContext: common
          }
        });

        container.addChild(test)
      }
      viewModel.set("process", false)   
    }   
  }
  if (!hided) {
    let t = {}
    t.text = "Вы скрыли все карточки. Перейдите в режим редактирования, чтобы открыть их."
    container.removeChildren()
    const emp = builder.load({
        path: '~/components/empty',
        name: 'empty',
        attributes: {
           bindingContext: t
        }
        });
          container.addChild(emp)
    }
            
}
names2 = {}
names2.items = t2
} 
exports.onPageLoaded = onPageLoaded;

function loadItems() {
  return new Promise(function(resolve, reject) {
    try {
      onRefreshButtonTap()
      resolve('great success');
    } catch (ex) {
      reject(ex);
    }
  });
}

function refreshCards(args) {
    var pullRefresh = args.object;
    loadItems().then(
    resp => {
      setTimeout(() => {
        pullRefresh.refreshing = false;
      }, 1200);
    },
    err => {
      pullRefresh.refreshing = false;
    }
  );
}
exports.refreshCards = refreshCards


function onEdit(args) {
  const frame = args.object.page.frame;
  console.log(frame)
    frame.navigate({
        moduleName: 'edit/edit-page',
        transition: {
            name: "fade"
        },
        context: {
            names2: names2,
            names: names
        },                            
        backstackVisible: true,
        clearHistory: false
    });
}
exports.onEdit = onEdit;


function onRefresh(args){
  onRefreshButtonTap();
  
}
exports.onRefresh = onRefresh;

function onExit(args){
  const frame = args.object.page.frame;
  //const frame = getFrameById("framecard");

   appSettings.setString("username", "");
   appSettings.setString("hash", "");
   appSettings.setString("token", "");

  // console.log(frame)
    frame.navigate({
        moduleName: 'login/login-page',
        
        transition: {
            name: "fade"
        },
        backstackVisible: false,
        clearHistory: true
    });

}
exports.onExit = onExit;
