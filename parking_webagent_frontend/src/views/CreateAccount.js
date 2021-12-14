import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ListIcon from "@mui/icons-material/List";
import { Alert, Button, Container, Grid, Paper, Snackbar } from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router";
import { axiosApiInstance } from "../routes";

export default function CreateAccount(props) {
  const userList = props.location.state;
  const useridList = userList.map((m) => m.userid);
  const [failVO, setFailVO] = React.useState({ fail: false, message: "" });
  const history = useHistory();
  const [password, setPassword] = React.useState("");
  const [confirmPwd, setConfirmPwd] = React.useState("");
  const [id, setId] = React.useState("");
  const [duplacated, setDuplacated] = React.useState(false);

  const handleClose = () => {
    setFailVO({ ...failVO, fail: false });
  };

  const idDupliChk = (val) => {
    setDuplacated(useridList.includes(val));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (id === "" || password === "" || confirmPwd === "") {
      setFailVO({ ...failVO, fail: true, message: "필수 입력란을 모두 입력하세요" });
    } else if (password !== confirmPwd) {
      setFailVO({ ...failVO, fail: true, message: "비밀번호를 확인하세요" });
    } else if (duplacated) {
      setFailVO({ ...failVO, fail: true, message: "중복된 아이디가 있습니다" });
    } else {
      axiosApiInstance
        .post(
          "http://localhost:8080/user/add",
          {
            id: data.get("id"),
            password: data.get("password"),
          }
          //{ withCredentials: true}
        )
        .then(
          (res) => {
            alert("계정 생성 성공");
            history.push("/accountlist");
          },
          (error) => {
            console.log("got: " + error.response.data);
            setFailVO({ ...failVO, fail: true, message: "계정생성에 실패하였습니다" });
          }
        );
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        verticalAlign: "center",
        flexDirection: "column",
        height: 600,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button startIcon={<ListIcon />} onClick={() => history.push("/accountlist")}></Button>
        </Grid>

        <Grid item xs={12}>
          <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Snackbar autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={failVO["fail"]} onClose={handleClose}>
              <Alert onClose={handleClose} severity='error'>
                {failVO["message"]}
              </Alert>
            </Snackbar>
            <Container maxWidth='sm'>
              <Grid container>
                <Grid item xs={12}>
                  <h2>관리자 계정 생성</h2>
                </Grid>
                <Grid item xs={3}>
                  <h4>ID</h4>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    name='id'
                    label='아이디'
                    error={duplacated}
                    helperText={duplacated ? "중복된 아이디입니다" : ""}
                    onChange={(e) => {
                      setId(e.target.value);
                      idDupliChk(e.target.value);
                    }}
                    variant='standard'
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <h4>비밀번호</h4>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    name='password'
                    label='비밀번호'
                    placeholder='7자리이상 입력하세요'
                    type='password'
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    autoComplete='current-password'
                    variant='standard'
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <h4>비밀번호 확인</h4>
                </Grid>
                <Grid item xs={9}>
                  <div>
                    <TextField
                      error={password !== confirmPwd}
                      helperText={password !== confirmPwd ? "비밀번호가 일치하지 않습니다" : " "}
                      name='passwordChk'
                      label='비밀번호 확인'
                      type='password'
                      autoComplete='current-password'
                      onChange={(e) => {
                        setConfirmPwd(e.target.value);
                      }}
                      variant='standard'
                      fullWidth
                      required
                    />
                  </div>
                </Grid>

                {/* <Grid item xs={12}>
              <h3>권한설정</h3>
            </Grid> */}
                <Grid item xs={12}></Grid>
              </Grid>
              <Button type='submit' variant='contained'>
                계정 만들기
              </Button>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
