package com.silzila.payload.internals;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
public class QueryClauseFieldListMap {

    private List<String> selectList = new ArrayList<>();
    private List<String> groupByList = new ArrayList<>();
    private List<String> orderByList = new ArrayList<>();

    public QueryClauseFieldListMap() {
    }

    public QueryClauseFieldListMap(List<String> selectList, List<String> groupByList, List<String> orderByList) {
        this.selectList = selectList;
        this.groupByList = groupByList;
        this.orderByList = orderByList;
    }

}
