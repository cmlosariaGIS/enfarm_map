<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>enfarm Map</title>
    <link rel="stylesheet" href="style.css">

    <!--Openlayers-->
    <script src="https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css">

    <!-- ol-ext -->
    <link rel="stylesheet" href="https://viglino.github.io/ol-ext/dist/ol-ext.css" />
    <script type="text/javascript" src="https://viglino.github.io/ol-ext/dist/ol-ext.js"></script>

    <!--Product Tour Library-->
    <script src="https://cdn.jsdelivr.net/npm/shepherd.js@10.0.1/dist/js/shepherd.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shepherd.js@10.0.1/dist/css/shepherd.css" />

    <!--Fonts-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

    <!-- Load Chart.js for displaying elevation profile -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!--Font Icons-->
    <script src="https://kit.fontawesome.com/0eb73cfc5c.js" crossorigin="anonymous"></script>

    <!--Animation files-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.10/lottie.min.js"></script>

    <!-- jQuery -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.11.0.min.js"></script>

    <!-- truf.js -->
    <script src='https://unpkg.com/@turf/turf@6/turf.min.js'></script>

    <script src="https://d3js.org/d3.v3.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css" />

    <!--MapTiler Basemap
    <script src="https://unpkg.com/ol-mapbox-style@12.1.1/dist/olms.js"></script>-->

    <style>
        /***** START MAP PRODUCT TOUR *****/
        /*Next Button*/
        .shepherd-button {
            background: #306b1b;
            font-family: 'Be Vietnam Pro', Arial, sans-serif;
            border: 0;
            border-radius: 100px;
            color: white;
            cursor: pointer;
            margin-right: .5rem;
            /*green next button padding*/
            padding: 0.5rem 1rem;
            transition: all .5s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }


        .shepherd-button:not(:disabled):hover {
            background: green;
            color: hsla(0, 0%, 100%, .75);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /*Modal*/
        .shepherd-element {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, .2);
            max-width: 350px;
            max-height: 150px;
            opacity: 0;
            outline: none;
            padding-left: 10px;
            padding-top: 5px;
            transition: opacity .3s, visibility .3s;
            visibility: hidden;
            width: 100%;
            z-index: 9999
        }

        .shepherd-button.shepherd-button-secondary {
            background: #3288e6;
            color: white;
            font-family: 'Be Vietnam Pro', Arial, sans-serif;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

        }

        .shepherd-button.shepherd-button-secondary:not(:disabled):hover {
            background: #196fcc;
            color: hsla(0, 0%, 100%, .75);
        }

        .shepherd-button:disabled {
            cursor: not-allowed
        }

        .shepherd-button {
            font-family: 'Be Vietnam Pro', Arial, sans-serif;
        }

        .shepherd-text p {
            margin-bottom: 0px;
        }

        .shepherd-has-title .shepherd-content .shepherd-header {
            background: #e6e6e6;
            padding: 1em
        }

        .shepherd-text {
            color: #515151;
            font-size: 1rem;
            line-height: 1.5rem;
            padding: .75em
        }

        .shepherd-text p:last-child {
            margin-bottom: 0
        }

        .shepherd-content {
            border-radius: 5px;
            outline: none;
            padding: 0
        }

        .shepherd-target.custom-triangle .shepherd-arrow {
            border-bottom: 10px solid transparent;
            border-top: 10px solid transparent;
            border-right: 10px solid white;
            border-left: 2px solid #515151;
            border-width: 2px;
            border-style: solid;
            border-color: #515151;
        }

        /***** END MAP PRODUCT TOUR *****/


        /****** START SCALE LINE STYLES *******/
        .ol-scale-line {
            position: fixed;
            bottom: 5vh;
            left: 20px;
            background: none;
            border: none;
            box-shadow: none;
            color: #515151;
            line-height: 1;
            margin: 0;
            padding: 0;
        }

        .ol-scale-line-inner {
            position: relative;
            background: #ffffff;
            border-radius: 3px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
            color: #515151;
            padding: 2px 2px;
            font-size: 14px;
            font-family: Be Vietnam Pro', Arial, sans-serif;

        }

        .ol-scale-line-inner::before,
        .ol-scale-line-inner::after {
            content: "";
            position: absolute;
            bottom: 0;
            width: 0.25px !important;
            height: 5%;
            background-color: #ffffff;
        }

        .ol-scale-line-inner::before {
            left: 25%;
        }

        .ol-scale-line-inner::after {
            right: 25%;
        }

        /****** END SCALE LINE STYLES *******/
    </style>
</head>

<body>

    <div class="map">

        <div id="map" class="map">
            <div class="blur-mask"></div>
        </div>


        <!----------------------------------------------------///// More Info on Grid Systems and Orientation Angle \\\\\---------------------------------------------------->
        <!--English-->
        <!--- <div id="moreInfoGridPropertiesWindow">
            <strong>More information about choosing the Farm Grid System and applying Grid Orientation Angle</strong>
            <p style="font-size: 30px; margin-bottom: 5px;"><strong><span style="color: green;">STEP 1. Choosing the
                        appropriate farm grid system</span></strong>
            </p>
            <p style="font-size: 30px; margin-top: 5px; text-align: justify;">The selection of a grid layout for a farm
                is a crucial decision. This involves strategically positioning coffee plants within the plot to ensure
                they are adequately spaced for optimal growth. It also involves accommodating the necessary number of
                plants per unit area.</p>
            <img src="https://i.ibb.co/G7rkPNn/grid-gif.gif" alt="Grid GIF"
                style="width: 200px; height: 200px; display: block; margin: 0 auto;">
            <p style="font-size: 30px; margin-top: 5px; text-align: justify;"> <strong><i>A. Square Farm Grid
                        System:</strong></i>
                This is the most adopted grid system. The farm is divided into squares, with a tree planted at each
                corner. This makes moving in between trees easy and farming tasks like planting, watering, spraying, and
                harvesting much simpler.</p>
            <p style="font-size: 30px; margin-top: 5px; text-align: justify;"> <strong><i>B. Rectangular Farm Grid
                        System:</strong></i> In this grid system, the plot is divided into rectangles instead of squares
                and trees are planted at the four corners of the rectangle. The same advantages which have been
                mentioned in the square grid system are also enjoyed here. The only difference is that in this system,
                more plants can be accommodated compared to the square grid system.</p>
            <p style="font-size: 30px; margin-top: 5px; text-align: justify;"> <strong><i>C. Triangular Farm Grid
                        System:</strong></i> In most situations, this system can accomodate more plants than the
                previous 2 grid systems. However it is a difficult system to implement and cultivating the farm plot
                under this system becomes more difficult.</p>
            <p style="font-size: 30px; margin-top: 5px; text-align: justify;"> Each farm grid system has its own
                advantages and is chosen based on factors such as the slope of land, purpose of utilizing the space,
                convenience etc. The choice of grid system can also affect light penetration and canopy growth, which
                are important factors for plant health.</p>
            <p style="font-size: 30px; margin-bottom: 5px;"><strong><span style="color: green;">STEP 2 (Optional). Specifying the
                        Orientation Angle</strong>
            </p>
            <img src="https://i.ibb.co/SwYvH3n/angle-gif-gif.gif" alt="Grid GIF"
                style="width: 180px; height: 180px; display: block; margin: 20px auto;">
            <p style="font-size: 30px; margin-top: 5px; text-align: justify;">Normally, the grid system lines up with
                the longest side of the farm plot. But, if you want, you can change the orientation by applying a
                different angle (like 0, 45, 90, 130, etc.). This can influence how many plants and grid lines you can
                fit in your farm parcel.
            </p>
            <img src="https://i.ibb.co/sQqqQMV/pill-explain.png" alt="Grid GIF"
                style="width: 550px; height: 250px; display: block; margin: 20px auto;">
            <p style="font-size: 30px; margin-top: 5px; text-align: justify;"><strong>Conclusion:</strong> Choosing the
                appropriate farm grid system and optionally, applying an orientation angle can influence the estimated
                number of coffee trees and grid lines needed to achieve the maximum potential output of a farm parcel.
            </p>
            <div>
                <button id="dismissMoreInfoGridPropertiesWindow" class="dismiss-button"
                    onclick="hideGrid()">Dismiss</button>
            </div>
            <br>
            <br>
        </div> --->

        <!----------------------------------------------------///// More Info on Grid Systems and Orientation Angle \\\\\---------------------------------------------------->
        <!--Vietnamese-->
        <div id="moreInfoGridPropertiesWindow">
            <strong>Thông tin thêm về việc chọn Hệ thống lưới trang trại và áp dụng Góc định hướng lưới</strong>
            <p style="font-size: 15px; margin-bottom: 5px;"><strong><span style="color: green;">BƯỚC 1. Chọn
                        hệ thống lưới trang trại thích hợp</span></strong>
            </p>
            <p style="font-size: 14px; margin-top: 5px; text-align: justify;">Lựa chọn sơ đồ lưới cho trang trại
                là một quyết định quan trọng. Điều này liên quan đến việc định vị chiến lược các cây cà phê trong khu
                đất để đảm bảo
                chúng được đặt cách nhau vừa đủ để tăng trưởng tối ưu. Nó cũng liên quan đến việc cung cấp số lượng cần
                thiết
                cây trồng trên một đơn vị diện tích.</p>
            <img src="https://i.ibb.co/G7rkPNn/grid-gif.gif" alt="Grid GIF"
                style="width: 90px; height: 90px; display: block; margin: 0 auto;">
            <p style="font-size: 14px; margin-top: 5px; text-align: justify;"> <strong><i>A. Lưới trang trại vuông
                        Hệ thống:</strong></i>
                Đây là hệ thống lưới được áp dụng nhiều nhất. Trang trại được chia thành các ô vuông, mỗi ô trồng một
                cây
                góc. Điều này làm cho việc di chuyển giữa các cây trở nên dễ dàng và các công việc canh tác như trồng,
                tưới nước, phun thuốc và
                thu hoạch đơn giản hơn nhiều.</p>
            <p style="font-size: 14px; margin-top: 5px; text-align: justify;"> <strong><i>B. Lưới trang trại hình chữ
                        nhật
                        Hệ thống:</strong></i> Trong hệ thống lưới này, ô được chia thành hình chữ nhật thay vì hình
                vuông
                và cây được trồng ở 4 góc của hình chữ nhật. Những ưu điểm tương tự đã có
                được đề cập trong hệ thống lưới vuông cũng được yêu thích ở đây. Sự khác biệt duy nhất là trong hệ thống
                này,
                có thể bố trí được nhiều cây hơn so với hệ thống lưới vuông.</p>
            <p style="font-size: 14px; margin-top: 5px; text-align: justify;"> <strong><i>C. Lưới trang trại hình tam
                        giác
                        Hệ thống:</strong></i>Trong hầu hết các tình huống, hệ thống này có thể chứa được nhiều cây hơn
                hệ thống
                2 hệ thống lưới trước đó. Tuy nhiên, đây là một hệ thống khó thực hiện và canh tác trên mảnh đất trang
                trại
                theo hệ thống này trở nên khó khăn hơn.</p>
            <p style="font-size: 14px; margin-top: 5px; text-align: justify;"> Mỗi hệ thống lưới trang trại có riêng
                lợi thế và được lựa chọn dựa trên các yếu tố như độ dốc của đất, mục đích sử dụng không gian,
                tiện lợi, v.v. Việc lựa chọn hệ thống lưới cũng có thể ảnh hưởng đến sự thâm nhập ánh sáng và sự phát
                triển của tán cây, điều này
                là những yếu tố quan trọng đối với sức khỏe thực vật.</p>
            <p style="font-size: 14px; margin-bottom: 5px;"><strong><span style="color: green;">BƯỚC 2 (Tùy chọn).
                        Chỉ định Góc định hướng</strong>
            </p>
            <img src="https://i.ibb.co/SwYvH3n/angle-gif-gif.gif" alt="Grid GIF"
                style="width: 90px; height: 90px; display: block; margin: 20px auto;">
            <p style="font-size: 14px; margin-top: 5px; text-align: justify;">Thông thường, hệ thống lưới nối với
                cạnh dài nhất của mảnh đất trang trại. Tuy nhiên, nếu muốn, bạn có thể thay đổi hướng bằng cách áp dụng
                một
                góc khác nhau (như 0, 45, 90, 130, v.v.). Điều này có thể ảnh hưởng đến số lượng cây và đường lưới bạn
                có thể
                phù hợp với bưu kiện trang trại của bạn.
            </p>
            <img src="https://i.ibb.co/brfttxm/pill-explain-vn.png" alt="Grid GIF"
                style="width: 250px; height: 125px; display: block; margin: 20px auto;">
            <p style="font-size: 14px; margin-top: 5px; text-align: justify;"><strong>Phần kết luận:</strong> Lựa chọn
                hệ thống lưới trang trại thích hợp và tùy chọn, việc áp dụng góc định hướng có thể ảnh hưởng đến kết quả
                ước tính
                số cây cà phê và đường lưới cần thiết để đạt được sản lượng tiềm năng tối đa của một thửa đất nông
                nghiệp.
            </p>
            <div>
                <button id="dismissMoreInfoGridPropertiesWindow" class="dismiss-button" onclick="hideGrid()">Miễn
                    nhiệm</button>
            </div>
            <br>
            <br>
        </div>


        <!-- Retrieved Grid Information Pill on browser refresh-->
        <div id="gridInfoPill" class="grid-info-pill hidden">
            <div id="pillTreeCount" class="pill-section">
                <img src="https://i.ibb.co/hDYvzYs/icons8-tree-64.png" alt="tree-icon" width="30" height="30">
                <span id="intersectionCount" class="pill-value">...</span>
            </div>
            <div id="pillYCount" class="pill-section">
                <span class="material-icons"
                    style="font-size: 20px; transform: rotate(90deg); color: #515151;">view_headline</span>
                <span id="gridYCount" class="pill-value">...</span>
            </div>
            <div id="pillXCount" class="pill-section">
                <span class="material-icons" style="font-size: 20px; color: #515151;">view_headline</span>
                <span id="gridXCount" class="pill-value">...</span>
            </div>
            <div id="pillZCount" class="pill-section hidden">
                <span class="material-icons"
                    style="font-size: 20px; transform: rotate(45deg); color: #515151;">view_headline</span>
                <span id="gridZCount" class="pill-value">...</span>
            </div>
        </div>


        <!-- Grid Pattern Information Pill -->
        <div id="gridPatternInformation" class="hidden">

            <div class="countContainer" id="squareGridTreeCountContainer">
                <img src="https://i.ibb.co/hDYvzYs/icons8-tree-64.png" alt="tree-icon">
                <p id="squareGridCount">...</p>
            </div>

            <div class="countContainer" id="squareGridYCountContainer">
                <span class="material-icons" style="font-size: 25px; transform: rotate(90deg);">view_headline</span>
                <p id="squareGridYCount">...</p>
            </div>

            <div class="countContainer" id="squareGridXCountContainer">
                <span class="material-icons" style="font-size: 25px;">view_headline</span>
                <p id="squareGridXCount">...</p>

            </div>

            <div class="countContainer" id="rectangularGridTreeCountContainer" style="display: none;">
                <img src="https://i.ibb.co/hDYvzYs/icons8-tree-64.png" alt="tree-icon">
                <p id="rectangularGridCount">...</p>
            </div>

            <div class="countContainer" id="rectangularGridYCountContainer" style="display: none;">
                <span class="material-icons" style="font-size: 25px; transform: rotate(90deg);">view_headline</span>
                <p id="rectangularGridYCount">...</p>
            </div>

            <div class="countContainer" id="rectangularGridXCountContainer" style="display: none;">
                <span class="material-icons" style="font-size: 25px;">view_headline</span>
                <p id="rectangularGridXCount">...</p>
            </div>

            <div class="countContainer" id="triangularGridTreeCountContainer" style="display: none;">
                <img src="https://i.ibb.co/hDYvzYs/icons8-tree-64.png" alt="tree-icon">
                <p id="triangularGridCount">Loading...</p>
            </div>

            <div class="countContainer" id="triangularGridYCountContainer" style="display: none;">
                <span class="material-icons" style="font-size: 25px; transform: rotate(90deg);">view_headline</span>
                <p id="triangularGridYCount">...</p>
            </div>

            <div class="countContainer" id="triangularGridXCountContainer" style="display: none;">
                <span class="material-icons" style="font-size: 25px;">view_headline</span>
                <p id="triangularGridXCount">...</p>
            </div>

            <div class="countContainer" id="triangularGridZCountContainer" style="display: none;">
                <span class="material-icons" style="font-size: 25px; transform: rotate(45deg);">view_headline</span>
                <p id="triangularGridZCount">...</p>
            </div>

        </div>


        <!-- Grid Properties Container for Pattern and Angle of orientation -->
        <div class="gridPropertiesContainer" id="gridPropertiesContainer">
            <div style="display: flex; justify-content: flex-end; margin-right: 10px;">
                <!--<button class="closeGridPropertiesContainer"
                    style="border: none; background: none; cursor: pointer; margin-top: 0px; margin-right: 10px">
                    <i class="material-icons" style="font-size: 50px; color: red;">cancel</i>
                </button>-->


                <button class="moreInfoBtnGridPropertiesContainer"
                    style="border: none; background: none; cursor: pointer; margin-top: 0px; margin-right: 10px"
                    onclick="toggleMoreInfoWindow()">
                    <i class="material-icons" style="font-size: 25px; color: #515151;">info</i>
                </button>


            </div>
            <div style="display: flex; align-items: center;">
                <i class="material-icons"
                    style="font-size: 14px; color: #515151; margin-left: 18px; margin-right: 0px;  margin-top: -20px;">grid_on</i>
                <p
                    style="font-size: 14px; color: #515151; margin-left: 10px; margin-top: -20px; margin-bottom: 0px; font-weight: bold;">
                    Bước 1. Vui lòng chọn mô hình lưới trang trại:</p>
            </div>
            <div class="gridTypeContainer">
                <button class="gridTypeOptionBtn1" style="text-align: center; display: block;">
                    <img src="https://i.ibb.co/XV5MT5b/square-grid-glow.png" alt="Square Grid" width="50" height="50"
                        style="display: block; margin: auto; margin-bottom: 20px;">
                    Vuông 3x3mét
                </button>
                <button class="gridTypeOptionBtn2" style="text-align: center; display: block;">
                    <img src="https://i.ibb.co/px3VKVM/rectangular-grid-glow.png" alt="Rectangle Grid" width="50"
                        height="50" style="display: block; margin: auto; margin-bottom: 20px;">
                    Chữ nhật 3x2.5mét
                </button>
                <button class="gridTypeOptionBtn3" style="text-align: center; display: block;">
                    <img src="https://i.ibb.co/y4YsWN0/traingular-grid-glow.png" alt="Triangular Grid" width="50"
                        height="50" style="display: block; margin: auto; margin-bottom: 20px;">
                    Tam giác 3x3mét
                </button>
            </div>
            <div class="gridAngleContainer">
                <label for="angle-input" style="display: flex; align-items: center;">
                    <i class="material-icons"
                        style="font-size: 15px; color: #515151;  margin-left: 18px; margin-right: 5px;">rotate_90_degrees_ccw</i>
                    <p
                        style="font-size: 14px; color: #515151; margin-left: 10px; margin-top: 5px; margin-bottom: 5px; font-weight: bold;">
                        Bước 2. Xoay lưới trang trại (optional):</p>
                </label>
                <div class="gridAngleInputContainer" style="display: flex; align-items: center;">
                    <input type="text" id="rotate-input" placeholder=" 0°"
                        style="margin-right: 0px; margin-left: 30px; margin-bottom: 20px;">
                    <button id="apply-button" style="margin-left: 0px; margin-right: 50px; margin-bottom: 20px;">
                        <i class="material-icons">rotate_90_degrees_ccw</i> Áp dụng
                    </button>
                    <button id="save-button" style="margin-left: 80px; margin-bottom: 20px;">
                        <span class="material-icons-outlined">save</span> Lưu
                    </button>
                </div>
            </div>
        </div>
        <br>
    </div>




    <!------------------------------------------------///// Current Activity Tool \\\\\--------------------------------------------------------------->
    <div id="measuringAreafloatingTitle" class="measuringAreafloatingTitle" style="display: none;">
        <i class="material-icons" style="font-size: 30px; padding-right: 10px; color: #515151;">square_foot</i>
        <span class="measuringAreaTitle" style="color: #515151;">Đo diện tích</span> <!--Measuring Area-->
    </div>

    <div id="measuringLengthfloatingTitle" class="measuringLengthfloatingTitle" style="display: none;">
        <i class="material-icons" style="font-size: 30px; padding-right: 10px; color: #515151;">straighten</i>
        <span class="measuringLengthTitle" style="color: #515151;">Đo độ dài</span> <!--Measuring Length-->
    </div>

    <div id="sketchingFarmfloatingTitle" class="sketchingFarmfloatingTitle" style="display: none;">
        <i class="material-icons" style="font-size: 30px; padding-right: 10px; color: #515151;">create</i>
        <span class="sketchingFarmTitle" style="color: #515151;">Vẽ đất nông nghiệp của
            bạn</span><!--Sketching a Farm Parcel-->
    </div>

    <div id="addSensorsfloatingTitle" class="addSensorsfloatingTitle" style="display: none;">
        <i class="material-icons" style="font-size: 30px; padding-right: 10px; color: #515151;">sensors</i>
        <span class="addSensorsTitle" style="color: #515151;">Thêm cảm biến Enfarm</span><!--Adding enfarm sensors-->
    </div>

    <div id="generateElevationProfilefloatingTitle" class="generateElevationProfilefloatingTitle"
        style="display: none;">
        <i class="material-symbols-outlined" style="font-size: 30px; padding-right: 5px; color: #515151;">elevation</i>
        <span class="generateElevationProfileTitle" style="color: #515151;">Đo chiều cao</span>
        <!-- Generate Elevation Profile -->
    </div>



    <!---------------------------------------------------///// Adding Farm and Sensor Success Message \\\\\------------------------------------------->
    <div id="addSensorSuccess" class="addFloating-container">
        <div id="sensorsuccessAnimationCheck" class="animationCheck"></div>
        <div class="addMessage">cảm biến enfarm được thêm vào</div> <!--enfarm sensor/s added-->
    </div>

    <div id="addFarmSuccess" class="addFloating-container">
        <div id="farmsuccessAnimationCheck" class="animationCheck"></div>
        <div class="addMessage">Đã thêm ranh giới trang trại</div>
        <!-- Da tehm ranh gioi trang trai - Farm boundary added-->
    </div>


    <button id="deletePointBtn" style="display: none;">Delete Point</button>


    <!-----------------------------------------------------///// Windy Weather \\\\\------------------------------------------------------------------->
    <button id="windyMapBtn">
        <img class="windyIcon" src="https://i.ibb.co/Hxs1JTC/windy-icon.png" alt="Windy Icon">
        <span class="windyMapBtn-text"></span>
    </button>

    <div id="windyMapContainer" style="display: none;"></div>


    <!----------///// SEARCH BUTTON AND FUNCTIONS \\\\\---------->

    <div id="logoDiv">
        <img src="https://i.ibb.co/LCK5s6V/en-Farm-logo-6-2x.png" alt="Logo" class="enfarmLogo" id="logo">
    </div>

    <button id="searchBtn" class="searchBtn">
        <i class="material-icons">search</i>
    </button>

    <div id="searchBar" class="searchBar" style="display: none;">
        <input id="searchInput" class="searchInput" type="text" placeholder="  Tra Cứu.." style="font-size: 20px;" />
        <!--Search for a place...-->
        <div id="loadingIcon" class="loadingIcon" style="visibility: hidden; margin-left: -30px;">
            <i class="material-icons"
                style="font-size: 30px; color: #515151; animation: spin 1s infinite linear; margin-right: -30px;">
                sync
            </i>
        </div>
        <div id="suggestionsContainer" class="suggestionsContainer"></div>
        <button id="searchButton" class="searchButton">
            <i class="material-icons">search</i>
        </button>
    </div>

    <!--<button id="searchKeywordBtn" class="searchKeywordBtn">Search Keyword Button</button>-->
    <div id="suggestionsContainer"></div>



    <!----------///// BASEMAP BUTTON AND FUNCTIONS \\\\\---------->

    <div class="basemapfloatingTitle" style="display: flex; align-items: center;">
        <img src="https://i.ibb.co/F4dSJw6/bm-street-circle.png" style="width: 30px; height: 30px; padding-right: 5px;">
        <span class="basemapTitle" style="display: inline-block;"></span>
    </div>


    <div id="basemapswitcher" class="basemapswitcher">
        <button id="basemapBtn" class="basemapBtn" onclick="cycleBasemap()">
            <i class="material-icons">layers</i>
        </button>
    </div>

    <!-- Basemap Selector Thumbnails -->
    <div class="basemapSelector" id="basemapSelector">
        <div class="container-content">
            <h2>
                <i class="material-icons" style="font-size: 25px; vertical-align: middle;">layers</i>
                Chọn bản đồ nền
            </h2>
            <div class="close-bm-button" onclick="closeBasemapSelector()">
                <i class="material-icons">cancel</i>
            </div>
            <div class="image-container">
                <div onclick="selectBasemap(1)" style="position: relative;">
                    <img src="https://i.ibb.co/Jjg7bMD/bm-street.png" alt="Đường phố">
                    <div class="osminfo-icon" style="position: absolute; top: 5px; left: 8px;">
                        <i class="material-icons"
                            style="font-size: 25px; color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">info</i>
                    </div>
                    <div class="caption">Đường phố</div>
                    <div class="selected-basemap-circle"></div>
                </div>

                <div onclick="selectBasemap(2)" style="position: relative;">
                    <img src="https://i.ibb.co/j3fq23k/bm-imagery.png" alt="Vệ tinh" border="0">
                    <div class="mapboxinfo-icon" style="position: absolute; top: 3px; left: 8px;">
                        <i class="material-icons"
                            style="font-size: 25px; color: white; text-shadow: px 2px 4px rgba(0, 0, 0, 0.5);">info</i>
                    </div>
                    <div class="caption">Vệ tinh</div>
                    <div class="selected-basemap-circle"></div>
                </div>

                <div onclick="selectBasemap(0)" style="position: relative;">
                    <img src="https://i.ibb.co/52KrTf7/bm-terrain.png" alt="Địa hình" border="0">
                    <div class="gebcoinfo-icon" style="position: absolute; top: 5px; left: 8px;">
                        <i class="material-icons"
                            style="font-size: 25px; color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">info</i>
                    </div>
                    <div class="caption">Địa hình</div>
                    <div class="selected-basemap-circle"></div>
                </div>

                <div onclick="selectBasemap(0)" style="position: relative;">
                    <img src="https://i.ibb.co/VM1tBQj/bm-carbon.png" alt="Tín chỉ Các bon" border="0">
                    <div class="info-icon" style="position: absolute; top: 5px; left: 8px;">
                        <i class="material-icons"
                            style="font-size: 25px; color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">info</i>
                    </div>
                    <div class="caption">Tín chỉ Các bon</div>
                    <div class="selected-basemap-circle"></div>
                </div>


                <div onclick="selectBasemap(3)" style="position: relative;">
                    <img src="https://i.ibb.co/n73N7QY/bm-ph.png" alt="Bản đồ pH" border="0">
                    <div class="info-icon" style="position: absolute; top: 5px; left: 8px;">
                        <i class="material-icons"
                            style="font-size: 25px; color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">info</i>
                    </div>
                    <div class="caption">Bản đồ pH</div>
                    <div class="selected-basemap-circle"></div>
                </div>

                <div onclick="selectBasemap(4)" style="position: relative;">
                    <img src="https://i.ibb.co/Krtp9sf/bm-nitrogen.png" alt="Bản đồ Ni tơ" border="0">
                    <div class="info-icon" style="position: absolute; top: 5px; left: 8px;">
                        <i class="material-icons"
                            style="font-size: 25px; color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">info</i>
                    </div>
                    <div class="caption">Bản đồ Ni tơ</div>
                    <div class="selected-basemap-circle"></div>
                </div>

            </div>
        </div>
    </div>

    <!--Basemap Attributions-->
    <div class="osm-attribution">
        <i class="material-icons close-button" onclick="closeAttribution('.osm-attribution')"
            style="color: #ff4d4d;">cancel</i>
        <br><br>
        <p>Map data
        <p><a href="https://www.maptiler.com/" target="_blank">©MapTiler</a></p>
        <p><a href="https://www.openstreetmap.org/" target="_blank">©OpenStreetMap contributors</a></p>
        </p>

    </div>

    <div class="mapbox-attribution">
        <i class="material-icons close-button" onclick="closeAttribution('.mapbox-attribution')"
            style="color: #ff4d4d;">cancel</i>
        <br><br>
        <p>Map data <a href="https://www.mapbox.com/" target="_blank">©Mapbox</a></p>
    </div>


    <div class="gebco-attribution">
        <i class="material-icons close-button" onclick="closeAttribution('.gebco-attribution')"
            style="color: #ff4d4d;">cancel</i>
        <br><br>
        <p>Map data <a href="https://www.gebco.net" target="_blank">©GEBCO</a></p>
        <p>Imagery reproduced from the GEBCO_2022 Grid, GEBCO Compilation Group (2022) GEBCO 2022 Grid
            (doi:10.5285/e0f0bb80-ab44-2739-e053-6c86abc0289c)</p>
    </div>

    <div class="isric-attribution">
        <i class="material-icons close-button" onclick="closeAttribution('.isric-attribution')"
            style="color:#ff4d4d;">cancel</i>
        <br>
        <br>
        <p>Đây là một phần của SoilGrids Maps và được quản lý bởi ISRIC (International Soil Reference and
            Information Centre)</p>
        <!--<p>This map is part of SoilGrids Maps and is maintained by ISRIC (International Soil Reference and
                Information Centre).</p>-->
        <br>
        <!--<p>Local accuracy is not guaranteed. To know more about the SoilGrids Maps Programme, click on this <span
                        class="hidden-link"
                        onclick="window.open('https://www.isric.org/explore/soilgrids/faq-soilgrids', '_blank')">link</span>.
            </p>-->
        <p>Độ chính xác cục bộ không được đảm bảo. Để biết thêm về Chương trình SoilGrids Maps, hãy nhấp vào đây
            <span class="hidden-link"
                onclick="window.open('https://www.isric.org/explore/soilgrids/faq-soilgrids', '_blank')">link</span>.
        </p>
    </div>

    <!-- Basemap Legends -->
    <!--Terrain Legend-->
    <div class="terrainlegend" id="terrainlegend">
        <div class="closeterrainLegend">
            <i class="material-icons">cancel</i>
        </div>
        <div class="terraincontainer">
            <div class="terrainicon">
                <i class="material-icons" style="font-size: 15px; color: #515151;">trending_up</i>
            </div>
            <div class="terrainicon">
                <i class="material-icons" style="font-size: 25px; color: #515151;">landscape</i>
            </div>
            <div class="terraintext">Địa hình</div>
        </div>
        <div class="terrainLegend">
            <div class="terraincolorValueContainer">
                <div class="terraincolorBox" style="background: #afead9;"></div>
                <div class="terraincolorBox" style="background: #85d09a;"></div>
                <div class="terraincolorBox" style="background: #70c888;"></div>
                <div class="terraincolorBox" style="background: #6cbd79;"></div>
                <div class="terraincolorBox" style="background: #69b673;"></div>
                <div class="terraincolorBox" style="background: #59b570;"></div>
                <div class="terraincolorBox" style="background: #67a964;"></div>
                <div class="terraincolorBox" style="background: #a7ad7d;"></div>
                <div class="terraincolorBox" style="background: #caa963;"></div>
                <div class="terraincolorBox" style="background: #8a701b;"></div>
                <div class="terraincolorBox" style="background: #8c691d;"></div>
                <div class="terraincolorBox" style="background: #836418;"></div>
                <div class="terraincolorBox" style="background: #86621a;"></div>
                <div class="terraincolorBox" style="background: #765e0d;"></div>
                <div class="terraincolorBox" style="background: #73540a;"></div>
                <div class="terraincolorBox" style="background: #ede8eb;"></div>
                <div class="terraincolorBox" style="background: #fafcf9;"></div>
            </div>
        </div>
        <div class="textContainer">
            <div class="low">thấp</div>
            <div class="high">cao</div>
        </div>
    </div>

    <!--Carbon Legend-->
    <div class="carbonlegend" id="carbonlegend">
        <div class="carbonLegend" id="carbonLegend">
            <div class="text">kg/m2</div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #ffffca;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">0</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #ffffbe;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">5</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #ffffbd;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">11</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #ffefa7;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">18</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #ffefa7;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">25</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #ffe091;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">31</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #fad27c;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">38</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #fad27c;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">45</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #dbcc6d;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">51</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #b8bc5d;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">58</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #b8bc5d;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">65</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #8b9d4e;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">71</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #688941;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">78</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #688941;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">85</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #498939;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">91</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #32893f;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">98</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #32893f;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">105</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #2a895a;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">111</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #2a895a;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">118</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #1f8671;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">125</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #16817c;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">131</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #16817c;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">138</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #0c6e7b;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">145</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #035675;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">151</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #035675;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">158</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #094273;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px">165</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #1a3273;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">171</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #1a3273;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">178</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #2a2173;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">185</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #3b1073;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">191</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #3b1073;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">198</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #4c0073;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">205</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #4c0073;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">212</div>
                </div>
            </div>
        </div>
        <div class="closecarbonLegend">
            <i class="material-icons">cancel</i>
        </div>
    </div>

    <!--pH Legend-->
    <div class="pHlegend" id="pHlegend">
        <div class="phLegend">
            <div class="text">pHx10</div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #F0F63C;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">0</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #F0F63D;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">34</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #F1EE2D;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">48</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #F1E51C;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">51</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #EBE51A;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">52</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #E0E41A;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">54</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #C0DF28;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">55</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #A5DB36;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">56</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #8DD645;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">57</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #86D44E;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">58</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #80D253;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">59</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #72C94C;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">60</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #61C041;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">61</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #51B836;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">62</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #4BB736;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">64</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #42B532;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">65</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #42B532;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">67</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #36ad31;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">68</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #35A536;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">70</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #4CA851;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">72</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #329A3D;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">73</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #2F993F;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">75</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #2C9840;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">76</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #2a9945;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">77</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #4CB075;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">79</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #35B993;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">80</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #2CB5A2;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">81</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #28B6B5;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">82</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #1BC1C7;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">83</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #0FCCD9;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">92</div>
                </div>
            </div>
        </div>
        <div class="closepHLegend">
            <i class="material-icons">cancel</i>
        </div>
    </div>

    <!--Nitrogen Legend-->
    <div class="nitrogenlegend" id="nitrogenlegend">
        <div class="nitrogenLegend">
            <div class="text">g/kg</div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #F7FCF5;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">0</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #F7FCF5;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">42</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #F3FBF0;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">80</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #EEF9EB;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">119</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #EAF7E6;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">157</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #E6F6E1;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">196</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #DEF3D9;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">234</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #D7F0D1;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">273</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #CFEDC9;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">311</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #C8EAC1;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">350</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #BEE6B8;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">388</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #BCE5B6;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">427</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #B9E3B2;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">466</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #ABDEA5;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">504</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #A2DA9C;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">543</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #97D593;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">581</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #8CCF8A;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">620</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #81CA80;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">658</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #75C577;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">697</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #71C277;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">735</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #5CB96A;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">774</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #4FB264;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">812</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #3aa458;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">851</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #339C52;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">890</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #2A944C;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">928</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #248C46;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">967</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #248C47;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">1005</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #19873F;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">1044</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #14853C;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">1082</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #0F8339;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">1121</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #0A8136;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">1159</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #027D30;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">1198</div>
                </div>
            </div>
            <div class="colorValueContainer">
                <div class="colorBox" style="background-color: #007D30;"></div>
                <div class="values">
                    <div class="value" style="font-size: 12px;">1237</div>
                </div>
            </div>
        </div>
        <div class="closenitrogenLegend">
            <i class="material-icons">cancel</i>
        </div>
    </div>





    <!----------///// SKETCH FARM BUTTON AND FUNCTIONS \\\\\---------->
    <button id="sketchFarmBtn" class="sketchFarmBtn">
        <i class="material-icons">create</i>
    </button>

    <button id="undoSketchBtn" class="undoSketchBtn">
        <i id="undoSketchIcon" class="material-icons">undo</i>
    </button>

    <!-- Delete Confirm Dialog Box -->
    <div id="dialog" class="dialog hidden">
        <div class="dialog-content">
            <div
                style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: -60px;">
                <div id="deleteAnimationContainer" style="width: 75px; height: 75x;"></div>
                <p style="margin: 0;">Bạn có muốn xóa bản vẽ?</p>
            </div>
            <div style="display: flex; justify-content: center;">
                <button id="deleteYes" class="dialog-button"
                    style="background-color: #d40133; color: white; display: flex; align-items: center;">
                    <i class="material-icons" style="font-size: 25px; margin-right: 8px;">delete_forever</i>
                    <span>Đúng</span>
                </button>
                <button id="deleteNo" class="dialog-button"
                    style="background-color: white; color: #515151; border: 2px solid #A9A9A9;">Không</button>

            </div>
        </div>
    </div>


    <!--Finish Sketch Button-->
    <div class="sketch-buttons">
        <button id="finishMeasuringArea" class="finish-measuringArea hidden"
            style="font-size: 18px; background-color: #386c34; color: white;">
            <span class="material-icons" style="font-size: 20px;">done_outline</span>
            Hoàn Thành
        </button>

        <button id="finishMeasuringLength" class="finish-measuringLength hidden"
            style="font-size: 18px; background-color: #386c34; color: white;">
            <span class="material-icons" style="font-size: 20px;">done_outline</span>
            Hoàn Thành
        </button>

        <button id="finishDrawingButton" class="finish-drawing hidden"
            style="font-size: 18px; background-color: #386c34; color: white;">
            <span class="material-icons" style="font-size: 20px;">done_outline</span>
            Hoàn Thành
        </button>

        <button id="finishAddingSensor" class="finish-addingsensor hidden"
            style="font-size: 18px; background-color: #386c34; color: white;">
            <span class="material-icons" style="font-size: 20px;">done_outline</span>
            Hoàn Thành
        </button>
    </div>

    <!----------///// ADD SENSOR BUTTON AND FUNCTIONS \\\\\---------->
    <button id="addSensorBtn" class="addSensorBtn">
        <i class="material-icons">sensors</i>
    </button>

    <button id="undoSensorBtn" class="undoSensorBtn">
        <i class="material-icons">undo</i>
    </button>

    <!----------///// PRODUCT TOUR TUTORIAL BUTTON AND FUNCTIONS \\\\\---------->

    <button id="tutorialBtn">
        <i class="material-icons">menu_book</i>
    </button>

    <!----------///// CLEAR ALL DRAWINGS BUTTON AND FUNCTIONS \\\\\---------->

    <button id="clearAllDrawingBtn" class="hidden">
        <i class="material-icons">delete</i>
    </button>

    <!----------///// NORTH ARROW BUTTON AND FUNCTIONS \\\\\---------->

    <div id="northArrow" class="northArrow">
        <i class="material-icons" style="color: #FF6666;">navigation</i>
    </div>


    <!----------///// GET USER LOCATION BUTTON AND FUNCTIONS \\\\\---------->

    <button id="locationBtn" class="locationBtn" onclick="getUserLocation()">
        <i class="material-icons">gps_fixed</i>
    </button>


    <!----------///// RESET MAP BUTTON AND FUNCTIONS \\\\\---------->

    <button id="resetBtn">
        <i class="material-icons">restart_alt</i>
    </button>

    <!----------///// 3D PERSPECTIVE BUTTON AND FUNCTIONS \\\\\---------->

    <button id="perspectiveBtn">
        <i class="material-icons">3d_rotation</i>
    </button>

    <input id="angle" type="range" step="1" min="0" max="15" onchange="map.setPerspective(this.value)" value="0"
        style="vertical-align: middle;" class="perspectiveSlider" />





    <!--<h1>OpenLayers Elevation Profile</h1>-->
    <!--<div id="map"></div>-->



    <!----------///// MEASURE AREA BUTTON AND FUNCTIONS \\\\\---------->

    <button id="measureAreaBtn" class="measureAreaBtn" onclick="startMeasurementArea()">
        <i class="material-icons">square_foot</i>
    </button>


    <!----------///// MEASURE LENGTH BUTTON AND FUNCTIONS \\\\\---------->

    <button id="measureLengthBtn" class="measureLengthBtn" onclick="startMeasurementLength()">
        <i class="material-icons">straighten</i>
    </button>

    <!----------///// GENERATE ELEVATION PROFILE BUTTON AND FUNCTIONS \\\\\---------->

    <button id="elevProfileBtn">
        <i class="material-symbols-outlined">elevation</i>
    </button>

    <div id="elevation-container">
        <div id="icon-elevation-container">
            <span class="material-icons-outlined"
                style="font-size: 15px; margin-right: -5px; vertical-align: middle;">trending_up</span>
            <span class="material-icons-outlined" style="font-size: 30px;">landscape</span>
            <div id="elevation-text">Elevation Profile</div>
        </div>
        <canvas id="chart" style="display: none;"></canvas>
        <div id="animation-container" style="width: 200px; height: 200px;"></div>
        <div id="elevation-values" style="display: flex; justify-content: space-between;">
            <span id="min-elevation"></span>
            <span id="max-elevation"></span>
        </div>
        <span id="close-elevation-container" class="material-icons"
            style="font-size: 24px; color: #ff4d4d;">cancel</span>
        <span id="info-ElevProfile-disclaimer-btn" class="material-icons" style="font-size: 24px;">info</span>
    </div>

    <button id="finishdrawLineElevProfile" class="finish-drawLineElevProfile hidden"
        style="font-size: 18px; background-color: #386c34; color: white;">
        <span class="material-icons" style="font-size: 20px;">done_outline</span>
        Hoàn Thành
    </button>

    <!--<button class="info-ElevProfile-disclaimer-btn">Show Disclaimer</button>-->

    <div class="elevation-tool-disclaimer" id="elevationToolDisclaimer" style="display: none;">
        <button class="close-ElevProfile-disclaimer-btn">
            <span class="material-icons" style="font-size: 24px; color: #ff4d4d;">cancel</span>
        </button>
        <!--<p>This tool is meant to show indicative values only and is not meant to replace on-ground survey or be used for engineering purposes.</p>-->
        <p>Công cụ này chỉ nhằm mục đích hiển thị các giá trị biểu thị và không nhằm thay thế khảo sát trên mặt đất hoặc
            được sử dụng cho mục đích kỹ thuật.</p>
    </div>

    <!----------///// GPS DRAW FARM BUTTON AND FUNCTIONS \\\\\---------->
    <!-- HTML buttons -->
    <button id="gpsDrawFarmBtn">
        <i class="material-symbols-outlined">mode_of_travel</i>
    </button>


    <button id="gpsDrawFarmStartBtn" class="hidden" onclick="draw.start()">
        <i class="material-symbols-outlined">play_arrow</i>
    </button>

    <button id="gpsDrawFarmPauseBtn" class="hidden" onclick="draw.pause()">
        <i class="material-symbols-outlined">pause</i>
    </button>

    <button id="gpsDrawFarmStopBtn" class="hidden" onclick="draw.stop()">
        <i class="material-symbols-outlined">stop_circle</i>
    </button>

    <button id="gpsDrawFarmSaveDrawBtn" class="hidden" onclick="gpsDrawSave()">
        <i class="material-symbols-outlined">save</i>
    </button>
    
    <button id="gpsDrawFarmDiscardDrawBtn" class="hidden" onclick="gpsDrawDiscard()">
        <i class="material-symbols-outlined">delete_forever</i>
    </button>



    <!--<script src="https://cdn.jsdelivr.net/npm/idb-js@2.0.0/dist/Idb.min.js"></script>-->
    <!--<script src="script.js"></script>-->


    <script src="01_enfarm_logo_redirect.js"></script>
    <script src="02_map_product_tour.js"></script>
    <script src="03_windy.js"></script>
    <script src="11_basemap_selector.js"></script>
    <script src="04_user_location.js"></script>
    <!--<script src="04A_pan_to_user_or_parcel.js"></script>-->
    <script src="05_refresh_map.js"></script>
    <script src="06_perspective.js"></script>
    <script src="07_scale_bar.js"></script>
    <script src="08_search_place_coordinates.js"></script>
    <!--<script src="09_sketch_farm.js"></script>-->
    <script src="09_sketch_farm_ver2.js"></script>

    <script src="09_gps_draw.js"></script>

    <script src="10_add_sensors.js"></script>
    <script src="12_measure_area.js"></script>
    <script src="13_measure_length.js"></script>
    <script src="14_elevation_profile.js"></script>
    <script src="15_north_arrow.js"></script>
    <!--<script src="16_birds_cloud_weather.js"></script>-->


</body>

</html>
