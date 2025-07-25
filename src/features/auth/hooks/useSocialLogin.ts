import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  type AuthError,
} from "firebase/auth";
import type { AuthProvider } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

import { auth } from "@shared/firebase/firebase";
import { useSnackbarStore } from "@shared/stores/snackbarStore";

export const useSocialLogin = (): {
  socialLogin: (provider: AuthProvider) => Promise<void>;
} => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { showError } = useSnackbarStore();

  const socialLogin = async (provider: AuthProvider): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, provider);

      // Firebase 신규 유저 여부 확인
      const additionalInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalInfo?.isNewUser;

      if (isNewUser) {
        navigate("/signup", { state: { fromSocial: true } });
      } else {
        navigate(redirect);
      }
    } catch (error: unknown) {
      const authError = error as AuthError;

      // 계정 충돌 에러 처리
      if (authError.code === "auth/account-exists-with-different-credential") {
        await handleAccountConflict(authError);
        return;
      }

      // 기타 에러 처리
      handleGeneralError(authError);
    }
  };

  const handleAccountConflict = async (error: AuthError): Promise<void> => {
    const email = error.customData?.email;
    if (!email) {
      showError("이메일 정보를 가져올 수 없습니다.");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        showError("이미 다른 로그인 방법으로 가입된 이메일입니다.");
        return;
      }

      if (methods.includes("google.com")) {
        showError(
          "이미 Google 계정으로 가입된 이메일입니다. Google 로그인을 이용해주세요."
        );
      } else {
        showError(`이미 가입된 로그인 방법: ${methods.join(", ")}`);
      }
    } catch {
      showError("로그인 방법 조회 중 오류가 발생했습니다.");
    }
  };

  const handleGeneralError = (error: AuthError): void => {
    // 일반적인 에러 코드별 처리
    switch (error.code) {
      case "auth/popup-closed-by-user":
        // 사용자가 팝업을 닫은 경우는 알림하지 않음
        break;
      case "auth/popup-blocked":
        showError("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
        break;
      case "auth/network-request-failed":
        showError("네트워크 연결을 확인해주세요.");
        break;
      case "auth/user-disabled":
        showError("비활성화된 계정입니다.");
        break;
      case "auth/invalid-credential":
        showError("잘못된 로그인 정보입니다.");
        break;
      case "auth/operation-not-allowed":
        showError("해당 로그인 방법이 허용되지 않습니다.");
        break;
      case "auth/too-many-requests":
        showError(
          "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요."
        );
        break;
      default:
        showError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return { socialLogin };
};
