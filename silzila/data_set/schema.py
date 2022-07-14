from pydantic import BaseModel
from typing import Optional, List, Any
# from typing import Literal # 3.8 and above
from typing_extensions import Literal  # 3.7 and below

####################### Data Set Creation #########################


class TablePosition(BaseModel):
    x: int
    y: int


class Table(BaseModel):
    table_name: str
    schema_name: str
    id: str
    alias: str
    table_position: Optional[TablePosition]


class Tables(BaseModel):
    __root__: List[Table]


class Relationship(BaseModel):
    table1: str
    table2: str
    cardinality: str
    ref_integrity: str
    table1_columns: List[str]
    table2_columns: List[str]


class RelationshipOut(BaseModel):
    table1: str
    table2: str
    cardinality: str
    ref_integrity: str
    table1_columns: List[str]
    table2_columns: List[str]


class DataSchema(BaseModel):
    tables: List[Table]
    relationships: Optional[List[Relationship]]


class DataSchemaOut(BaseModel):
    tables: List[Table]
    relationships: Optional[List[RelationshipOut]]


class DataSetIn(BaseModel):
    dc_uid: str
    friendly_name: str
    data_schema: DataSchema


class DataSetOut(BaseModel):
    dc_uid: str
    ds_uid: str
    friendly_name: str
    data_schema: DataSchemaOut

####################### Data Set Query #########################


class Dim(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    time_grain: Optional[Literal['year', 'quarter', 'month',
                                 'yearquarter', 'yearmonth', 'date', 'dayofweek', 'dayofmonth']]
    expr: Optional[str]


class Measure(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    aggr: Literal['sum', 'avg', 'min', 'max', 'count',
                  'countnn', 'countn', 'countu']
    time_grain: Optional[Literal['year', 'quarter',
                                 'month', 'date', 'dayofweek', 'dayofmonth']]
    expr: Optional[str]


class Field(BaseModel):
    table_id: str
    field_name: str
    display_name: str


class Filter(BaseModel):
    filter_type: Literal['binary_user_selection', 'text_user_selection', 'number_user_selection',
                         'number_search', 'date_user_selection', 'date_search']
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    negate: Optional[bool]
    user_selection: Optional[List[Any]]
    search_type: Optional[Literal['equal_to', 'not_equal_to', 'greater_than', 'less_than',
                                  'greater_than_equal_to', 'less_than_equal_to', 'between']]
    search_condition: Optional[List[Any]]
    time_grain: Optional[Literal['year',
                                 'month', 'quarter', 'dayofweek', 'day']]


class Query(BaseModel):
    dims: Optional[List[Dim]]
    measures: Optional[List[Measure]]
    fields: Optional[List[Field]]
    filters: Optional[List[Filter]]


############################################################################
#################### To populte dropped fields in Filter ###################
############################################################################
# API: /ds/filter-options/<dc uid>/<ds uid>

# class CalendarPeriod(BaseModel):
#     span_type: Literal['calendar']
#     last: int
#     next: int


# class RollingPeriod(BaseModel):
#     span_type: Literal['rolling']
#     last: int
#     next: int


# class CalendarToRollingPeriod(BaseModel):
#     span_type: Literal['calendar_to_rolling']
#     last: int
#     next: int


# class RollingToCalendarPeriod(BaseModel):
#     span_type: Literal['rolling_to_calendar']
#     last: int
#     next: int


class ColumnFilterRegular(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    filter_type: Literal['pick_from_list',
                         'search_condition', 'aggregate_level_match']
    aggr: Optional[Literal['sum', 'avg', 'min', 'max', 'count',
                           'countnn', 'countn', 'countu']]
    time_grain: Optional[Literal['year', 'quarter',
                                 'month', 'yearquarter', 'yearmonth', 'date', 'dayofweek', 'dayofmonth']]


# class ColumnFilterRelativeSpan(BaseModel):
#     table_id: Optional[str]
#     field_name: Optional[str]
#     display_name: Optional[str]
#     data_type: Literal['date', 'timestamp']
#     filter_type: Literal['today', 'tomorrow',
#                          'yesterday', 'column_latest_date']
#     time_grain: Optional[Literal['year', 'quarter', 'month',
#                                  'day', 'week', 'week2']]
#     relative_span_options: Optional[Union[CalendarPeriod, RollingPeriod,
#                                           CalendarToRollingPeriod, RollingToCalendarPeriod]]


# class ColumnFilter(BaseModel):
#     regular_filter: Optional[ColumnFilterRegular]
#     # relative_filter: Optional[ColumnFilterRelativeSpan]


class ColumnFilter(BaseModel):
    filter_type: Literal['binary_user_selection', 'text_user_selection', 'number_user_selection',
                         'number_search', 'date_user_selection', 'date_search']
    table_id: Optional[str]
    field_name: Optional[str]
    display_name: Optional[str]
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    # filter_type: Literal['pick_from_list',
    #                      'search_condition', 'aggregate_level_match']
    # aggr: Optional[Literal['sum', 'avg', 'min', 'max', 'count',
    #                        'countnn', 'countn', 'countu']]
    time_grain: Optional[Literal['year', 'quarter',
                                 'month', 'yearquarter', 'yearmonth', 'date', 'dayofweek', 'dayofmonth']]
