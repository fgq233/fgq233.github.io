function clickBlog() {
    let d = new Date();
    let r = d.getFullYear() + (d.getMonth() + 1) + d.getDate();
    let s = Encrypt(r);
    let ret = prompt('范老师帅不帅', '帅');
    // if(ret !== null && ret === Decrypt(s)) {
        window.location.href = "https://fgq233.github.io/md/blog";
    // }
    // if(ret !== null && ret === '帅') {
    //     window.location.href = "https://fgq233.github.io/md/blog";
    // }
}
