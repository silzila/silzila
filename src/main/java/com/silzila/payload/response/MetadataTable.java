package com.silzila.payload.response;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MetadataTable {
    private List<String> tables = new ArrayList<>();
    private List<String> views = new ArrayList<>();

    public MetadataTable() {
    }

    public MetadataTable(List<String> tables, List<String> views) {
        this.tables = tables;
        this.views = views;
    }

}
