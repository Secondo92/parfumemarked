import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";



function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [radioValue, setRadioValue] = useState("option1");
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();


    function handleSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();
        console.log({
            email,
            password,
            radioValue,
            checked,
        });
        navigate("/");
    }

    return (
        <form onSubmit={handleSubmit}>

            <div className="row mb-3">
                <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                    Email
                </label>
                <div className="col-sm-10">
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                    Password
                </label>
                <div className="col-sm-10">
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <fieldset className="row mb-3">
                <legend className="col-form-label col-sm-2 pt-0">Radios</legend>
                <div className="col-sm-10">

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="gridRadios"
                            id="gridRadios1"
                            value="option1"
                            checked={radioValue === "option1"}
                            onChange={() => setRadioValue("option1")}
                        />
                        <label className="form-check-label" htmlFor="gridRadios1">
                            First radio
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="gridRadios"
                            id="gridRadios2"
                            value="option2"
                            checked={radioValue === "option2"}
                            onChange={() => setRadioValue("option2")}
                        />
                        <label className="form-check-label" htmlFor="gridRadios2">
                            Second radio
                        </label>
                    </div>

                    <div className="form-check disabled">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="gridRadios"
                            id="gridRadios3"
                            value="option3"
                            disabled
                        />
                        <label className="form-check-label" htmlFor="gridRadios3">
                            Third disabled radio
                        </label>
                    </div>

                </div>
            </fieldset>

            <div className="row mb-3">
                <div className="col-sm-10 offset-sm-2">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="gridCheck1"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="gridCheck1">
                            Example checkbox
                        </label>
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary">
                Sign in
            </button>

        </form>
    );
}

export default Login;
