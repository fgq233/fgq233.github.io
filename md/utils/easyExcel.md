### EasyExcel 行合并策略

#### 1. 策略

```java
package com.alibaba.excel.write.merge;

import com.alibaba.excel.write.handler.RowWriteHandler;
import com.alibaba.excel.write.metadata.holder.WriteSheetHolder;
import com.alibaba.excel.write.metadata.holder.WriteTableHolder;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;

import java.util.Arrays;

public class SameRowMergeStrategy implements RowWriteHandler {

    // 从哪一行开始合并
    private final int mergeStartRowIndex;
    // 哪些列需要合并行
    private final int[] needMergeColumnArr;
    private final int needMergeMaxColumnIndex;
    // 合并唯一标识的列索引
    private final int flagIndex;
    // 数据总行数(不包括表头)
    private final int totalRow;
    // 合并的起始行
    private int firstRow;
    // 合并的结束行
    private int lastRow;
    // 当前合并次数，1代表不合并
    private int mergeCount = 1;

    public SameRowMergeStrategy(int mergeStartRowIndex, int[] needMergeColumnArr, int flagIndex, int totalRow) {
        this.mergeStartRowIndex = mergeStartRowIndex;
        this.needMergeColumnArr = needMergeColumnArr;
        this.needMergeMaxColumnIndex = Arrays.stream(needMergeColumnArr).max().orElse(0);
        this.flagIndex = flagIndex;
        this.totalRow = totalRow;
    }


    /**
     * 行后事件，Excel中每一行操作结束都会调用一次
     */
    @Override
    public void afterRowDispose(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Row row, Integer relativeRowIndex, Boolean isHead) {
        // 当前行
        int curRowIndex = row.getRowNum();
        // 每一行的最大列数
        int lastCellNum = row.getLastCellNum();
        // 首次赋值 第一行
        if (curRowIndex == 1) {
            firstRow = curRowIndex;
        }
        // 查找合并位置、进行合并
        if (curRowIndex > mergeStartRowIndex && lastCellNum >= needMergeMaxColumnIndex) {
            findNeedMergeRow(writeSheetHolder.getSheet(), curRowIndex, row);
        }
        // 如果是最后一行，则隐藏唯一标志所在列
        if (curRowIndex == totalRow) {
            writeSheetHolder.getSheet().setColumnHidden(flagIndex, true);
        }
    }


    public void findNeedMergeRow(Sheet sheet, int curRowIndex, Row row) {
        Object currentCellVal = row.getCell(flagIndex).getCellTypeEnum() == CellType.STRING ? row.getCell(flagIndex).getStringCellValue() : row.getCell(flagIndex).getNumericCellValue();
        Row preRow = row.getSheet().getRow(curRowIndex - 1);
        Object preCellVal = preRow.getCell(flagIndex).getCellTypeEnum() == CellType.STRING ? preRow.getCell(flagIndex).getStringCellValue() : preRow.getCell(flagIndex).getNumericCellValue();
        // 判断上一行和当前行是否具有同一标志
        boolean isSameFlag = currentCellVal.equals(preCellVal);
        // 前后两行具有同一标志，则合并尾行暂定当前行，合并次数 + 1
        if (isSameFlag) {
            lastRow = curRowIndex;
            mergeCount++;
        }
        // 遇到了标志不一致的行，且合并次数 > 1，则开始合并单元格
        if (!isSameFlag && mergeCount > 1) {
            mergeCell(sheet);
            mergeCount = 1;
        }
        // 合并次数 = 总行数，则代表当前列的所有行都需合并
        if (mergeCount > 1 && totalRow == curRowIndex) {
            mergeCell(sheet);
            mergeCount = 1;
        }
        // 不是同一标志，则重置合并的起始行
        if (!isSameFlag) {
            firstRow = curRowIndex;
        }

    }

    private void mergeCell(Sheet sheet) {
        for (int colNum : needMergeColumnArr) {
            CellRangeAddress cellRangeAddress = new CellRangeAddress(firstRow, lastRow, colNum, colNum);
            sheet.addMergedRegion(cellRangeAddress);
        }
    }
}
```


#### 2. 使用
```
@Getter
@Setter
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class XData {

    @ExcelProperty("id")
    private String id;

    @ExcelProperty("日期")
    private Date date;

    @ExcelProperty("内容")
    private String content;

    @ExcelProperty("不同")
    private String diff;

}

@Test
public void mergeWrite() {
    String fileName = "C:\\users\\Desktop\\" + System.currentTimeMillis() + ".xlsx";
    SameRowMergeStrategy sameRowMergeStrategy = new SameRowMergeStrategy(1, new int[] {0, 1, 2}, 0, 10);
    EasyExcel.write(fileName, XData.class).registerWriteHandler(sameRowMergeStrategy).sheet("模板").doWrite(dataX());
}

private List<XData> dataX() {
    List<XData> list = ListUtils.newArrayList();
    list.add(new XData("1", new Date(), "123", "111"));
    list.add(new XData("1", new Date(), "123", "222"));
    list.add(new XData("1", new Date(), "123", "333"));
    list.add(new XData("2", new Date(), "123", "444"));
    list.add(new XData("2", new Date(), "123", "555"));
    list.add(new XData("3", new Date(), "123", "666"));
    list.add(new XData("3", new Date(), "123", "777"));
    list.add(new XData("4", new Date(), "123", "888"));
    list.add(new XData("4", new Date(), "123", "999"));
    list.add(new XData("5", new Date(), "123", "000"));
    return list;
}
```