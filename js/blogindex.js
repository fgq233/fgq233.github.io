function initBlog() {
    let blogList1 = [];
    let blogList2 = [];
    let blogList3 = [];
    let blogList4 = [];
    let key = GetQueryString("key");
    if (key === "cloud") {
        blogList1 = cloudList1;
        blogList2 = cloudList2;
        blogList3 = cloudList3;
        blogList4 = cloudList4;
    } else if (key === "java") {
        blogList1 = javaList1;
        blogList2 = javaList2;
        blogList3 = javaList3;
        blogList4 = javaList4;
    }

    let divHtml = "";

    for (let i = 1; i < 5; i++) {
        let blogList = i === 1 ? blogList1 : i === 2 ? blogList2 : i === 3 ? blogList3 : i === 4 ? blogList4 : [];

        divHtml += `<div class="rxui-col-md3">`;
        blogList.map((item, index) => {
            if (index === 0) {
                divHtml += `<ol>`;
            }

            if (item.child.length) {
                divHtml += `<li><h5>${item.title}</h5>`;
                item.child.map((childItem, idx) => {
                    if (idx === 0) {
                        divHtml += `<ul>`;
                    }
                    divHtml += `<li><a href="${childItem.url}">${childItem.title}</a></li>`;
                    if (idx === item.child.length - 1) {
                        divHtml += `</ul>`;
                    }
                });
                divHtml += `</li>`;
            } else {
                divHtml += `<li><h6><a href="${item.url}">${item.title}</a></h6></li>`;
            }

            if (index === blogList.length - 1) {
                divHtml += `</ol>`;
            }
        });
        divHtml += `</div>`;

    }

    $("#box").append(divHtml);


}


/**
 * 采用正则表达式获取地址栏参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
