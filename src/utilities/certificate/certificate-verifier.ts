
import jsigs from 'jsonld-signatures';
import {contexts} from 'security-context';
import {RSAKeyPair, Ed25519KeyPair} from 'crypto-ld';
import documentLoaders from 'jsonld';
import {credentialsv1} from './credentials';
import { CsHttpRequestType, CsHttpService, CsRequest } from '../../core/http-service/interface';
import { catchError, map } from "rxjs/operators";


const CERTIFICATE_CONTROLLER_ID =  'https://sunbird.org/';
const CERTIFICATE_DID =  'did:india';
export class CertificateVerifier {

    constructor(
        private httpService: CsHttpService,
    ) {
    }

    private publicKey = '';

    public async verifyData(signedJSON, publicKey): Promise<any>{
        this.publicKey = publicKey;
        try {
            const {AssertionProofPurpose} = jsigs.purposes;
            let result;
            console.log('in if')
            const publicKey = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_DID,
                type: 'RsaVerificationKey2018',
                controller: CERTIFICATE_CONTROLLER_ID,
                publicKeyPem: this.publicKey
            };
            const controller = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_CONTROLLER_ID,
                publicKey: [publicKey],
                // this authorizes this key to be used for making assertions
                assertionMethod: [publicKey.id]
            };
            const key = new RSAKeyPair({...publicKey});
            const {RsaSignature2018} = jsigs.suites;
            result = await jsigs.verify(signedJSON, {
                suite: new RsaSignature2018({key}),
                purpose: new AssertionProofPurpose({controller}),
                documentLoader: this.customLoader,
                compactProof: false
            });
            result.certificateData = {
                issuedTo: signedJSON.credentialSubject.name,
                issuanceDate: signedJSON.issuanceDate,
                issuerName: signedJSON.issuer.name,
                trainingName: signedJSON.credentialSubject.trainingName,
                trainigId: signedJSON.credentialSubject.trainingId
            };
            console.log('result in csl', result)
            return result;
            
        } catch (e) {
            console.log('Invalid data', e);
            throw new Error('Invalid data');
        }
    }
    
    public customLoader = async url => {
        console.log("checking " + url);
        const c = {
            "did:india": this.publicKey,
            "https://example.com/i/india": this.publicKey,
            "https://w3id.org/security/v1": contexts.get("https://w3id.org/security/v1"),
            'https://www.w3.org/2018/credentials#': credentialsv1,
            "https://www.w3.org/2018/credentials/v1": credentialsv1
            
        };
        let context = c[url];
        if (context === undefined) {
            console.log('context === undefined', contexts[url])
            context = contexts[url];
        }
        if (context !== undefined) {
            const c = {
                contextUrl: null,
                documentUrl: url,
                document: context
            };
            console.log('context !== undefined', c);
            return c;
    
        }
        if (url.startsWith("{")) {
            return JSON.parse(url);
        }
        console.log('before api call');
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withHost('https://')
            .withType(CsHttpRequestType.GET)
            .withPath(url.split('//')[1])
            .withBearerToken(false)
            .withUserToken(false)
            .build();

        const jsonResp = await this.httpService.fetch(apiRequest)
            .pipe(
                map((response) => {
                    return response.body;
                }),
                catchError(e => {
                    console.log('jsonResp e', e)
                    throw e;
                })
            ).toPromise();
            console.log('jsonResp---', jsonResp);
            const c1 = {
                contextUrl: null,
                documentUrl: url,
                document: jsonResp
            };
            console.log('context !== undefined---====', c1);
            return c1; 
    };
  
}
