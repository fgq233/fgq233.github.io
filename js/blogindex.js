function initBlog() {
    let blogList1 = [];
    let blogList2 = [];
    let blogList3 = [];
    let blogList4 = [];
    let key = getQueryString("key");
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
    } else if (key === "vue") {
        blogList1 = vueList1;
        blogList2 = vueList2;
        blogList3 = vueList3;
        blogList4 = vueList4;
    }

    let divHtml = "";

    for (let i = 1; i < 5; i++) {
        let blogList = i === 1 ? blogList1 : i === 2 ? blogList2 : i === 3 ? blogList3 : i === 4 ? blogList4 : [];

        divHtml += `<div class="ui-col-md3">`;
        blogList.map((item, index) => {
            if (index === 0) {
                divHtml += `<ol>`;
            }

            if (item.child && item.child.length) {
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
                divHtml += `<li><h5><a href="${item.url}">${item.title}</a></h5></li>`;
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
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
