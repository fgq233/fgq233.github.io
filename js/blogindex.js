function initBlog() {

    let divHtml = "";

    for (let i = 1; i < 5; i++) {
        let blogList = i === 1 ? blogList1 : i === 2 ? blogList2 : i === 3 ? blogList3 : i === 4 ? blogList4 : [];

        divHtml += `<div class="rxui-col-md3">`;
        blogList.map((item, index) => {
            if (index === 0) {
                divHtml += `<ol>`;
            }

            if (item.child.length) {
                divHtml += `<li><h6>${item.title}</h6>`;
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
