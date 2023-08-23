import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { Box, Divider, IconButton, Typography, useTheme, Snackbar, styled } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import CloseIcon from '@mui/icons-material/Close';

const SuccessPopup = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: 'white',
  borderRadius: '4px',
  padding: '8px 16px',
  boxShadow: theme.shadows[2],
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const LoadingOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
});

const PopupNotification = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: 'white',
  borderRadius: '4px',
  padding: '8px 16px',
  boxShadow: theme.shadows[2],
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'fixed',
  bottom: '20px',
  left: '20px', // Thay đổi từ right thành left
  zIndex: 10000,
}));

const ErrorPopup = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: 'white',
  borderRadius: '4px',
  padding: '8px 16px',
  boxShadow: theme.shadows[2],
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'fixed',
  bottom: '20px',
  left: '20px',
  zIndex: 10000,
}));

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  money,
}) => {
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [shouldRenderPopup, setShouldRenderPopup] = useState(false);
  const { _id } = useSelector((state) => state.user);
  const userRole = useSelector((state) => state.user.location);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handlePopupSubmit = async () => {
    const response = await fetch(`http://localhost:3001/posts/${_id}/${postUserId}/posts`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, amount: inputValue }),
      });
  
      if (response.ok) {
        setIsReloading(true);
        setShowSubmitPopup(true);
        setIsPopupOpen(false);
        setTimeout(() => {
          setShowSubmitPopup(false);

          // Nếu biến isReloading là true, thực hiện reload trang và đặt lại biến isReloading thành false
          // Đặt lại biến isReloading sau khi đã reload trang
          window.location.reload();
        }, 3000); // 3000 milliseconds = 3 seconds
      } else {
        // Xử lý khi có lỗi
        setShowErrorPopup(true);
        setIsPopupOpen(false);
        setTimeout(() => {
          setShowErrorPopup(false);
          setIsReloading(false);
          //window.location.reload();
        }, 3000);
          }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/${_id}/delete`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      // Xoá bài post khỏi Redux state
      // dispatch(deletePost(postId));
      setIsReloading(true);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        setIsReloading(false); 
        window.location.reload();
        }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      // Xử lý khi có lỗi
    }
  };

  const handleCommentSubmit = async () => {
    // Thực hiện các hành động cần thiết khi nhấn Submit trong popup
     // Đóng popup sau khi hoàn thành hành động
    try {
      const response = await fetch("http://localhost:3001/your/endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: inputValue }),
      });
  
      if (response.ok) {
        setIsCommentPopupOpen(false); // Đóng popup sau khi gửi thông báo thành công
      } else {
        // Xử lý khi có lỗi
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <Box>
      <WidgetWrapper m="2rem 0" >
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )}
        <FlexBetween mt="0.25rem" >
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsCommentPopupOpen(!isCommentPopupOpen)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
          
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsPopupOpen(!isPopupOpen)}>
              <MonetizationOnOutlinedIcon />
            </IconButton>
            <Typography>{money}$</Typography>
          </FlexBetween>
          
        </FlexBetween>
        {isCommentPopupOpen && (
          <div className="popup">
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Enter your comment"
            />
            <button onClick={handleCommentSubmit}>Submit</button>
            <button onClick={() => setIsCommentPopupOpen(false)}>Cancel</button>
          </div>
        )}
        {isPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            transition: "opacity 2.5s",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              zIndex: 10000,
              transform: isPopupOpen ? "translateY(0%)" : "translateY(-40%)",
              opacity: isPopupOpen ? 1 : 0,
              transition: "transform 2.5s, opacity 2.5s",
            }}
          >
            <Typography>Enter Amount</Typography>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter amount"
              style={{
                margin: "10px 0",
                padding: "5px",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={handlePopupSubmit}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            <button
              onClick={() => setIsPopupOpen(false)}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      </WidgetWrapper>
      <FlexBetween >
          {userRole === "admin" ? (
                <>
                  <IconButton sx={{
                      marginLeft: "auto", // Đẩy nút về phía bên phải
                    }} onClick={handleDelete}>
                              <DeleteOutlineOutlined />
                            </IconButton>
                  {/* Các đoạn mã khác */}
                </>
              ) : null}
      </FlexBetween >
      <Snackbar
        open={showSuccessPopup}
        autoHideDuration={3000}
        onClose={() => setShowSuccessPopup(false)}
      >
        <SuccessPopup>
          <div>Bài viết đã được xoá thành công.</div>
          <IconButton
            onClick={() => setShowSuccessPopup(false)}
            size="small"
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </SuccessPopup>
      </Snackbar>
      {/* Hiển thị popup thông báo */}
      {showSubmitPopup && (
        <PopupNotification>
          Notification sent successfully.
        </PopupNotification>
      )}
      <Snackbar open={showErrorPopup} autoHideDuration={3000} onClose={() => setShowErrorPopup(false)}>
      <ErrorPopup>
        <div>Số tiền trong tài khoản không đủ.</div>
        <IconButton onClick={() => setShowErrorPopup(false)} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </ErrorPopup>
    </Snackbar>
    </Box>
  );
};

export default PostWidget;
