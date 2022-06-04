import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as uuid from "uuid";
import { Stopwatch } from "../../components/Stopwatch";

it("verify if button exist", () => {
    const UUID = uuid.v1();

    var {getByText} = render(<Stopwatch uuid={UUID}/>)
    
    expect(getByText("start/stop")).toBeInTheDocument()
})