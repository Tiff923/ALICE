import { useState } from "react"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import NerPieChart from "./NerPieChart"
import NerTable from "./NerTable"
import React from "react"

const EntityDisplay = (props) => {
    const {data, setSelectedNode} = props
    const [isPieChart, setPCorTB] = useState(true)

    const handleToggle = (event) => {
        setPCorTB(!isPieChart)
    }

    return(
        <>
        <FormControlLabel
            label='PieChart'
            control = {<Switch checked={isPieChart} onChange={handleToggle} />}
        />
        { isPieChart ? (
            <NerPieChart
                data = {data}
            />
        ) : (
            <NerTable
                data = {data}
                setSelectedNode={setSelectedNode}
            />
        )}
        </>
    )
}

export default EntityDisplay