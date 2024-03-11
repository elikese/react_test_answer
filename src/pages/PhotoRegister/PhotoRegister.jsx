/** @jsxImportSource @emotion/react */
import * as S from "./style";
import WideButton from "../../components/WideButton/WideButton";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 *  1. 사진 불러오기 버튼을 클릭 후 5개 이상의 이미지를 불러올 수 있어야함.
 *  2. PromiseAll을 사용하여 이미지를 순서대로 불러와야함.
 *  3. 불러오기가 완료되면 "이미지를 저장하시겠습니까?" 라는 확인 취소 메세지 창이 떠야함.
 *  4. 확인 클릭시 localStorage에 key: photo, value: JSON 데이터
 *      [
 *          {
 *              id: 1,
 *              imageUrl: ""
 *          },
 *          {
 *              id: 2,
 *              imageUrl: ""
 *          }
 *      ]
 *      형식으로 저장되어야함.
 *  5. 취소시 저정되면 안됨.
 */

function PhotoRegister() {
    const [loadPhotoes, setloadPhotoes] = useState([]);
    const [photoSeq, setPhotoSeq] = useState([]);
    const fileRef = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        setloadPhotoes(() => loadPhotoes.map(photo => {
            return (
                {
                    ...photo,
                    seq: photoSeq.includes(photo.id) ? photoSeq.indexOf(photo.id) + 1 : 0
                }
            )
        }), [photoSeq])

    }, [photoSeq])

    const handleFileChange = (e) => {
        const fileList = e.target.files;
        const fileArray = Array.from(fileList);

        if (e.target.files.length === 0) {
            return;
        }

        const Promises = fileArray.map(
            file => new Promise(
                (resolve, reject) => {
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        resolve(e.target.result);
                        fileRef.current.value = "";
                    }

                    reader.readAsDataURL(file);
                }
            )
        )

        Promise.all(Promises).then(res => {
            setloadPhotoes(() => res.map((dataUrl, index) => {
                return (
                    {
                        id: index + 1,
                        seq: 0,
                        dataUrl
                    }
                )
            }));
        })
    }

    const handlePhotoCheck = (id) => {
        if (photoSeq.includes(id)) {
            setPhotoSeq((photoSeq) => photoSeq.filter(seq => seq !== id))
        } else {
            setPhotoSeq((photoSeq) => [...photoSeq, id]);
        }
    }

    const handleSubmitClick = () => {
        const isSave = window.confirm("사진을 저장하시겠습니까?");

        if (!isSave) {
            return;
        }

        const localStorageFiles = !localStorage.getItem("photo") ? [] : JSON.parse(localStorage.getItem("photo"));
        const lastId = localStorageFiles.length === 0 ? 0 : localStorageFiles[localStorageFiles.length - 1].id;

        const newPhotoes = loadPhotoes
            .filter(photo => photo.seq !== 0)
            .sort((a, b) => a.seq - b.seq)
            .map((photo, index) => {
                return (
                    {
                        ...photo,
                        id: lastId + index + 1,
                    }
                );
            });

        const concatedNewFiles = [...localStorageFiles, ...newPhotoes];
        localStorage.setItem("photo", JSON.stringify(concatedNewFiles));
        alert("사진 저장을 완료하였습니다.");
        navigate("/photo/album");
    };

    return (
        <div css={S.layout}>
            <div css={S.header}>
                <h1 css={S.title}>사진 등록하기</h1>
                <button css={S.submitBtn} onClick={handleSubmitClick}>완료</button>
            </div>
            <input type="file" ref={fileRef} style={{ display: "none" }} multiple={true} onChange={handleFileChange} />
            <div css={S.container}>
                {loadPhotoes.map(photo => {
                    return (
                        <>
                            <input css={S.checkBox} id={"img" + photo.id} type="checkbox" onChange={() => handlePhotoCheck(photo.id)} />
                            <label css={S.imageBox} htmlFor={"img" + photo.id}>
                                <div>{photo.seq}</div>
                                <img src={photo.dataUrl} />
                            </label>
                        </>
                    )
                })}
            </div>
            <WideButton text={"사진 불러오기"} onClick={() => { fileRef.current.click() }} />
        </div>
    )

}
export default PhotoRegister;