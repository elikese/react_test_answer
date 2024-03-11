/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as S from "./style";
/**
 *  1. 사진 등록하기를 통해 등록된 이미지들을 각자 자유롭게 디자인하여 불러와야함.
 *  2. localStorage에 저장된 사진이 없으면 
 *      <h1>불러올 사진이 없습니다.</h1>
 *      문구가 중앙에 나오도록해야함.
 */

function PhotoAlbum() {
    const [loadPhotos, setLoadPhotos] = useState([]);
    useEffect(() => {
        const localStorageFiles =
            !localStorage.getItem("photo")
                ? []
                : JSON.parse(localStorage.getItem("photo"));
        setLoadPhotos(() => localStorageFiles);
    }, []);

    return (
        <div css={S.layout}>
            {
                loadPhotos.length === 0
                    ? <h1>불러올 사진이 없습니다.</h1>
                    : loadPhotos.map(photo => {
                        return (
                            <div key={photo.id} css={S.imageCard}>
                                <div css={S.imageBox}>
                                    <img src={photo.dataUrl} />
                                </div>
                            </div>
                        )
                    })
            }

        </div>
    );
}

export default PhotoAlbum;