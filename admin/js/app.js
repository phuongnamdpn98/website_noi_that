angular.module("myapp", ['ngRoute'])

    .config(function ($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: "views/order.html?" + Math.random(),
                controller: 'orderCtrl'

            })
            .when('/products/:maDanhMuc', {
                templateUrl: "views/product.html?" + Math.random(),
                controller: 'productCtrl'
            })
            
            .otherwise({
                template: '<h1> 404 - không tìm thấy trang</h1>'
            })
    })
    .controller("myadctrl", function ($scope, $http, $rootScope, $window) {
        $rootScope.dsPhongKhach = [];
        $rootScope.dsPhongAn = [];
        $rootScope.dsPhongNgu = [];
        $rootScope.dsPhongLamViec = [];
        $rootScope.Dia_chi_Dich_vu_img = 'http://localhost:8080';
        $rootScope.dsspDetail =[];
        $rootScope.dsOrder = [];
        apiPhongKhach().then(result => {
            localStorage.setItem("phongKhach", JSON.stringify(result))

            //console.log($rootScope.dsPhongKhach);
        }).catch(err => {
            console.log(err);
        })
        apiPhongAn().then(result => {
            localStorage.setItem("phongAn", JSON.stringify(result))

        }).catch(err => {
            console.log(err);
        })
        apiPhongNgu().then(result => {
            localStorage.setItem("phongNgu", JSON.stringify(result))

        }).catch(err => {
            console.log(err);
        })
        apiPhongLamViec().then(result => {
            localStorage.setItem("phongLamViec", JSON.stringify(result))

        }).catch(err => {
            console.log(err);
        })

        $rootScope.dsPhongKhach = JSON.parse(localStorage.getItem("phongKhach"));
        $rootScope.dsspDetail.push(...$rootScope.dsPhongKhach)

        $rootScope.dsPhongAn = JSON.parse(localStorage.getItem("phongAn"));
        $rootScope.dsspDetail.push(...$rootScope.dsPhongAn)

        $rootScope.dsPhongNgu = JSON.parse(localStorage.getItem("phongNgu"));
        $rootScope.dsspDetail.push(...$rootScope.dsPhongNgu)

        $rootScope.dsPhongLamViec = JSON.parse(localStorage.getItem("phongLamViec"));
        $rootScope.dsspDetail.push(...$rootScope.dsPhongLamViec)
        let admin =JSON.parse(localStorage.getItem("ADMIN"));
        $rootScope.NameAdmin = admin.username

        $scope.dangXuat = function(){
            localStorage.removeItem('ADMIN');
            $window.location.href=`../index.html`
        }
        
    })
    .controller("productCtrl", function ($scope, $http, $rootScope, $routeParams) {

        if ($routeParams.maDanhMuc == "phongKhach") {
            $rootScope.dssp = $rootScope.dsPhongKhach

        } else if ($routeParams.maDanhMuc == "phongAn") {
            //$scope.loaiDanhMuc = "./data/phongBep.json"
            $rootScope.dssp = $rootScope.dsPhongAn;

        } else if ($routeParams.maDanhMuc == "phongNgu") {
            //$scope.loaiDanhMuc = "./data/phongNgu.json"
            $rootScope.dssp = $rootScope.dsPhongNgu;

        } else if ($routeParams.maDanhMuc == "phongLamViec") {
            //$scope.loaiDanhMuc = "./data/phongLamViec.json"
            $rootScope.dssp = $rootScope.dsPhongLamViec;
        }

        $scope.limit = 8
        $scope.page = 1

        $scope.total = Math.ceil($rootScope.dssp.length / $scope.limit)
        console.log($scope.total)
        $scope.pagelist = [];
        for (let i = 1; i <= $scope.total; i++) {
            $scope.pagelist.push(i)
        }


        $scope.changePage = function (trang) {
            $scope.page = trang;
            $scope.limit = 8
            if (trang > $scope.total) {
                $scope.page = 1;
            }

            $scope.start = ($scope.page - 1) * $scope.limit;
        }

       
    })
    .controller("orderCtrl", function ($scope, $http, $rootScope, $routeParams){

    });