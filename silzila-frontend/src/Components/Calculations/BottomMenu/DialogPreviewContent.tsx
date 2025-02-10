import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FetchData from '../../ServerCall/FetchData';
import Skeleton from "@mui/material/Skeleton";

const DialogPreviewContent = ({

    calculationInfo,
    calculationName,
    token,
    workspaceId,
    datasetId,
    databaseId

}: {

    calculationInfo: any,
    calculationName: string,
    token: string,
    workspaceId: string,
    datasetId: string,
    databaseId: string

}) => {

    const [previewInfo, setPreviewInfo] = useState<null | any>(null)
    const [header, setHeader] = useState<null | any>(null)
    const [error, setError] = useState<null | any>(null)

    useEffect(() => {
        calculationInfo.calculatedFieldName = calculationName

        const url = databaseId ? `test-calculated-field?dbconnectionid=${databaseId}&workspaceId=${workspaceId}&datasetid=${datasetId}` : `test-calculated-field?workspaceId=${workspaceId}&datasetid=${datasetId}`

        FetchData({
            requestType: "withData",
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: [calculationInfo]
        })
            .then((res) => {
                if (res.status === true) {
                    setPreviewInfo(res.data)
                    setHeader(Object.keys(res.data[0])[0])
                } else {
                    setError("Something went wrong. Please try again later.")
                }
            })

    }, [])

    return (
        <div>
            {
                previewInfo ? <div>
                    <TableContainer style={{ marginTop: "10px", width: "200px", margin: "20px auto" }} component={Paper}>
                        <Table aria-label="simple table">
                            <TableBody>
                                {
                                    previewInfo.map((item: { [key: string]: number }, index: number) => {
                                        const key = Object.keys(item)[0]
                                        return <TableRow key={index}>
                                            <TableCell style={{ padding: '4px' }} align="left">{item[key] === null ? "(Blank)" : `${item[key]}`}</TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div> : <div>
                    {
                        error ? <div style={{ color: "red", margin: "20px 10px" }}>{error}</div> : <TableContainer style={{ marginTop: "10px", width: "200px", margin: "20px auto" }} component={Paper}>
                            <Table aria-label="simple table">
                                <TableBody>
                                    {
                                        Array.from(new Array(5)).map((_, index) => {
                                            return <TableRow key={index}>
                                                <Skeleton sx={{ fontSize: "1.3rem" }} variant="text" />
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </div>
            }
        </div>
    )
}

export default DialogPreviewContent