/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import WideButton from "../../components/WideButton/WideButton";
import { useInput } from "../../hooks/useInput";
import * as S from "./style";
import defaultProfile from "../../assets/images/profile/default.jpeg"
import { useNavigate } from "react-router-dom";


/**
 * 
 * 1. 이미지 클릭시 이미지 변경가능해야함.
 * 2. 수정하기 버튼 클릭시 localStorage에 key: user value: JSON데이터
 *  {
 *      nickname: "테스트계정",
 *      namd: "김준일",
 *      birthday: "1994-09-07",
 *      imgUrl: ""
 *  }
 *  저장되어야하고 페이지 로드시 불러와야함.
 * 3. RootHeader의 프로필 이미지도 변경되어야함.
 */
function Mypage() {
    const [nicknameValue, handleNicknameOnChange, setNicknameValue] = useInput();
    const [nameValue, handleNameOnChange, setNameValue] = useInput();
    const [birthdayValue, handleBirthdayOnChange, setBirthdayValue] = useInput();
    const [profileUrl, setProfileUrl] = useState(defaultProfile);

    const fileRef = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        const loadedUser = JSON.parse(localStorage.getItem("user"));
        if (!!loadedUser) {
            setNicknameValue(() => loadedUser.nickname);
            setNameValue(() => loadedUser.name);
            setBirthdayValue(() => loadedUser.birthday);
            setProfileUrl(() => loadedUser.imgUrl);
        }
    }, [])

    const handleFileChange = (e) => {
        if (e.target.files.length === 0) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileUrl(() => e.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    const handleSubmitClick = () => {
        const user = {
            nickname: nicknameValue,
            name: nameValue,
            birthday: birthdayValue,
            imgUrl: profileUrl
        }
        localStorage.setItem("user", JSON.stringify(user));
        alert("수정되었습니다!")
        navigate("/")
    }

    return (
        <div css={S.layout}>
            <div css={S.imageBox} onClick={() => { fileRef.current.click() }}>
                <input style={{ display: "none" }} ref={fileRef} type="file" onChange={handleFileChange} />
                <img src={profileUrl} alt="" />
            </div>
            <input css={S.inputBox} type="text" placeholder="닉네임" value={nicknameValue} onChange={handleNicknameOnChange} />
            <input css={S.inputBox} type="text" placeholder="이름" value={nameValue} onChange={handleNameOnChange} />
            <input css={S.inputBox} type="text" placeholder="생년월일" value={birthdayValue} onChange={handleBirthdayOnChange} />
            <WideButton text={"완료"} onClick={handleSubmitClick} />
        </div>
    );
}

export default Mypage;