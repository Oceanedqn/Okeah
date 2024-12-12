import React from 'react';
import { TextStyle } from 'src/styles/GlobalStyles';

interface PhotoUploadProps {
    label: string;
    photoField: 'picture1' | 'picture2';
    photoUrl: string | null;
    isBase64: (str: string) => boolean;
    canEditProfile: boolean;
    handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>, photoField: 'picture1' | 'picture2') => void;
    handleClickPhoto: (e: React.MouseEvent<HTMLDivElement>, photoField: 'picture1' | 'picture2') => void;
}

const PhotoUploadComponent: React.FC<PhotoUploadProps> = ({
    label,
    photoField,
    photoUrl,
    isBase64,
    canEditProfile,
    handlePhotoChange,
    handleClickPhoto,
}) => {
    return (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <TextStyle style={{ marginBottom: '5px', fontWeight: 'bold' }}> {label} </TextStyle>
            <div
                style={{ position: 'relative', width: '200px', height: '200px', backgroundColor: 'white', borderRadius: '28px', cursor: canEditProfile ? 'pointer' : 'default' }}
                onClick={(e) => handleClickPhoto(e, photoField)}
            >
                {photoUrl && isBase64(photoUrl) ? (
                    <img
                        src={photoUrl}
                        alt={`${photoField} Preview`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '28px' }}
                        loading="lazy"
                        onError={(e) => {
                            console.error('Image failed to load');
                            e.currentTarget.style.display = 'none'; // Cache l'image en cas d'erreur
                        }}
                    />
                ) : null}
                <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => handlePhotoChange(e, photoField)}
                    disabled={!canEditProfile}
                />
            </div>
        </div>
    );
};

export default PhotoUploadComponent;